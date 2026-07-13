'use client';

import {
  useBoardTitleActions,
  useBoardTitleState,
} from '@/components/Mutation/Board/Title/BoardTitleContext';
import { CheckmarkIcon, LoadingIcon, PencilIcon, XIcon } from '@/icons/icons';
import { updateBoardTitle } from '@/utils/actions/board';
import { useApolloClient } from '@apollo/client/react';
import { Input } from '@headlessui/react';
import {
  useCallback,
  useEffect,
  useId,
  type KeyboardEventHandler,
} from 'react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import IconButton from '../../IconButton';

type UpdateBoardTitleForm = {
  title: string;
};

type UpdateBoardTitleProps = {
  boardId: string;
  title: string;
};

const MAX_BOARD_TITLE_LENGTH = 30;

function UpdateBoardTitle({ boardId, title }: UpdateBoardTitleProps) {
  const client = useApolloClient();
  const { isUpdating } = useBoardTitleState();
  const {
    startUpdating: startUpdatingTitle,
    cancelUpdating: cancelUpdatingTitle,
  } = useBoardTitleActions();

  const inputId = useId();
  const helpId = useId();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting, isValid },
  } = useForm<UpdateBoardTitleForm>({
    defaultValues: { title },
    mode: 'onChange',
  });

  // Watched title input for dynamic width
  const watchedTitle = useWatch({
    control,
    name: 'title',
    defaultValue: title,
  });

  // Title input register
  const titleRegisterProps = register('title', {
    required: 'Board title is required',
    validate: {
      notBlank: (value) => value.trim().length > 0 || 'Board title is required',
      maxLength: (value) =>
        value.trim().length <= MAX_BOARD_TITLE_LENGTH ||
        `Title must not exceed ${MAX_BOARD_TITLE_LENGTH} characters`,
    },
  });

  // Cancel state: restores the title without submitting
  const cancelUpdating = useCallback(() => {
    reset({ title });
    cancelUpdatingTitle();
  }, [cancelUpdatingTitle, reset, title]);

  // Submit flow: cancel if the title is not changed, call the action, then update Apollo cache
  const updateBoardTitleHandler: SubmitHandler<UpdateBoardTitleForm> = async ({
    title: nextTitle,
  }) => {
    const trimmedTitle = nextTitle.trim();

    if (trimmedTitle === title) {
      cancelUpdating();
      return;
    }

    const formData = new FormData();
    formData.set('boardId', boardId);
    formData.set('title', trimmedTitle);

    try {
      const { data, error } = await updateBoardTitle(formData);
      if (error || !data) {
        toast.error(error ?? 'Failed to update board title');
        return;
      }

      // Update the normalized cache of `boards` directly
      // The active queries that depend on it should be refreshed automatically.
      client.cache.modify({
        id: client.cache.identify({ __typename: 'boards', id: boardId }),
        fields: {
          title: () => data.title,
        },
      });

      cancelUpdatingTitle();
    } catch {
      toast.error('Failed to update board title');
    }
  };

  // The form handles Enter submit; this keeps Escape as the cancel shortcut.
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    cancelUpdating();
  };

  // Auto-focus on the title input
  useEffect(() => {
    if (!isUpdating) return;
    setFocus('title');
  }, [isUpdating, setFocus]);

  // Reset form when navigate to different boards or the title changes
  useEffect(() => {
    reset({ title });
  }, [reset, title]);

  return (
    <form
      onSubmit={handleSubmit(updateBoardTitleHandler)}
      className='inline-flex flex-col'
    >
      <div className='inline-flex items-center gap-1 rounded-lg border-2 border-transparent has-[input:enabled]:bg-muted/50 has-[input:enabled:focus]:border-b-accent/70'>
        {/* Title Input */}
        <div className='inline-grid min-w-0 max-w-full px-0.5 sm:px-2 text-lg md:text-xl font-semibold tracking-wider'>
          <span
            aria-hidden
            className='invisible col-start-1 row-start-1 whitespace-pre overflow-hidden'
          >
            {watchedTitle || ' '}
          </span>
          <Input
            {...titleRegisterProps}
            id={inputId}
            type='text'
            size={1}
            aria-label='Board title'
            aria-describedby={helpId}
            aria-invalid={Boolean(errors.title?.message) ? true : undefined}
            disabled={!isUpdating || isSubmitting}
            onKeyDown={handleKeyDown}
            className='col-start-1 row-start-1 w-full border-transparent bg-transparent text-foreground outline-none transition disabled:cursor-default disabled:opacity-100 disabled:truncate'
          />
        </div>

        {isUpdating ? (
          isSubmitting ? (
            <LoadingIcon className='shrink-0' />
          ) : (
            <div className='flex shrink-0 items-center gap-1.5 md:gap-0.5'>
              {/* Submit Button */}
              <IconButton
                type='submit'
                Icon={CheckmarkIcon}
                label='Save board title'
                onClick={undefined}
                disabled={!isValid || isSubmitting}
                size='size-6'
                className='[&>svg]:stroke-successful sm:size-7 md:size-8'
              />
              {/* Cancel Button */}
              <IconButton
                Icon={XIcon}
                label='Cancel board title update'
                onClick={cancelUpdating}
                disabled={isSubmitting}
                size='size-6'
                className='[&>svg]:stroke-destructive sm:size-7 md:size-8'
              />
            </div>
          )
        ) : (
          // Enter Editing Button
          <IconButton
            Icon={PencilIcon}
            label={`Update ${title}`}
            onClick={startUpdatingTitle}
            className='hidden size-8 shrink-0 place-items-center text-muted-foreground/20 transition hover:cursor-pointer hover:text-muted-foreground focus:text-muted-foreground focus:outline-none dark:text-muted-foreground/40 md:grid'
          />
        )}
      </div>

      {/* Error Message */}
      <p id={helpId} aria-live='polite' className='sr-only'>
        {errors.title?.message}
      </p>
    </form>
  );
}
export default UpdateBoardTitle;
