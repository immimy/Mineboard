'use client';

import {
  AllBoardsDocument,
  AllBoardsQuery,
  AllBoardsQueryVariables,
} from '@/gql/__generated__/graphql';
import { PlusIcon } from '@/icons/icons';
import { createBoard } from '@/utils/actions/board';
import { useApolloClient } from '@apollo/client/react';
import { Button, Input } from '@headlessui/react';
import {
  useEffect,
  useId,
  useState,
  type Dispatch,
  type KeyboardEventHandler,
  type SetStateAction,
} from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';

export type PendingBoard = { id: string; title: string };

type AddBoardForm = {
  title: string;
};

type AddBoardTitleProps = {
  userId: string;
  isDisabled: boolean;
  setPendingBoards: Dispatch<SetStateAction<PendingBoard[]>>;
};

const MAX_BOARD_TITLE_LENGTH = 30;

function AddBoardTitle({
  userId,
  isDisabled,
  setPendingBoards,
}: AddBoardTitleProps) {
  const client = useApolloClient();
  const [isCreating, setIsCreating] = useState(false);

  const titleInputId = useId();
  const titleHelpId = useId();

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, isValid },
  } = useForm<AddBoardForm>({
    defaultValues: { title: '' },
    mode: 'onChange',
  });

  // Title input register
  const titleRegisterProps = register('title', {
    required: 'This is required.',
    validate: {
      notBlank: (value) => value.trim().length > 0 || 'This is required.',
      maxLength: (value) =>
        value.trim().length <= MAX_BOARD_TITLE_LENGTH ||
        `Max ${MAX_BOARD_TITLE_LENGTH} characters`,
    },
  });

  // Input state: swaps the button with a focused title input.
  const startCreating = () => {
    if (!userId || isDisabled) return;
    setIsCreating(true);
  };

  // Cancel state: restores the create button without submitting.
  const cancelCreating = () => {
    reset();
    setIsCreating(false);
  };

  // Submit flow: show a pending row, call the action, then update Apollo cache.
  const addBoardHandler: SubmitHandler<AddBoardForm> = async ({ title }) => {
    const pendingId = crypto.randomUUID();
    const trimmedTitle = title.trim();
    const formData = new FormData();
    formData.set('title', trimmedTitle);

    reset();
    setIsCreating(false);
    setPendingBoards((current) => [
      { id: pendingId, title: trimmedTitle },
      ...current,
    ]);

    try {
      const { data, error } = await createBoard(formData);
      if (error || !data) return toast.error(error ?? 'Failed to create board');

      const board = data.boardsCollection?.edges[0];
      if (!board)
        return toast.error('Failed to fetch new board, please refresh');

      // Update `AllBoardsQuery` by prepending new board to the collection
      client.cache.updateQuery<AllBoardsQuery, AllBoardsQueryVariables>(
        {
          query: AllBoardsDocument,
          variables: { userId },
        },
        (queryData) => {
          if (!queryData?.boardsCollection) return queryData;

          const boardExists = queryData.boardsCollection.edges.some(
            (edge) => edge.node.id === board.node.id,
          );
          if (boardExists) return queryData;

          return {
            ...queryData,
            boardsCollection: {
              ...queryData.boardsCollection,
              edges: [board, ...queryData.boardsCollection.edges],
            },
          };
        },
      );
    } catch {
      toast.error('Failed to create board');
    } finally {
      setPendingBoards((current) =>
        current.filter((board) => board.id !== pendingId),
      );
    }
  };

  // The form handles Enter submit; this keeps Escape as the cancel shortcut.
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    cancelCreating();
  };

  // Auto-focus on the title input
  useEffect(() => {
    if (!isCreating) return;
    setFocus('title');
  }, [isCreating, setFocus]);

  if (isCreating) {
    return (
      <form
        onSubmit={handleSubmit(addBoardHandler)}
        className='mt-4 space-y-1.5'
      >
        {/* Cancel Button */}
        <div className='flex justify-end'>
          <Button
            type='button'
            aria-label='Cancel add board'
            title='Cancel add board'
            onClick={cancelCreating}
            className='text-sm font-semibold text-foreground/80 hover:underline hover:text-foreground hover:cursor-pointer'
          >
            Cancel
          </Button>
        </div>

        <div className='flex items-center gap-1.5 rounded-md border border-border inset-ring inset-ring-border/50 bg-muted/50 px-3 py-2 text-sm font-medium focus-within:ring-accent/70 focus-within:ring-2'>
          {/* Title Input */}
          <Input
            {...titleRegisterProps}
            id={titleInputId}
            type='text'
            aria-label='Board title'
            aria-describedby={titleHelpId}
            aria-invalid={Boolean(errors.title?.message) ? true : undefined}
            placeholder='Board title'
            onKeyDown={handleKeyDown}
            className='min-w-0 flex-1 transition outline-none'
          />

          {/* Submit Button */}
          <Button
            type='submit'
            aria-label='Create board'
            title='Create board'
            disabled={!isValid}
            className='px-1.5 shrink-0 rounded-md bg-accent text-neutral ring-2 ring-accent  font-normal hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'
          >
            Enter
          </Button>
        </div>

        {/* Error Message */}
        <div
          id={titleHelpId}
          aria-live='polite'
          className='flex items-center justify-between gap-3 px-1 text-xs text-muted-foreground'
        >
          <span className='min-w-0 truncate text-destructive'>
            {errors.title?.message}
          </span>
        </div>
      </form>
    );
  }

  return (
    // Create Board Trigger
    <Button
      type='button'
      disabled={isDisabled}
      onClick={startCreating}
      className='mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:cursor-pointer hover:border-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:border-border disabled:hover:text-muted-foreground'
    >
      <PlusIcon className='size-4' />
      Create board
    </Button>
  );
}
export default AddBoardTitle;
