'use client';

import {
  Button,
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import FormContainer from '@/components/global/FormContainer';
import SubmitButton from '@/components/global/SubmitButton';
import { ColorInput, TextInput } from '@/components/form';
import { ActionFunction } from '@/types/app';
import { ColorPalette } from '@/types/jsonbSchema';
import { Dispatch, SetStateAction } from 'react';

export type CardFormState = { title: string; color: ColorPalette };

type CardDialogProps<TForm extends CardFormState = CardFormState> = {
  formId: string;
  title: string;
  description: string;
  open: boolean;
  form: CardFormState;
  onFormChange: Dispatch<SetStateAction<TForm>>;
  onClose: () => void;
  action: ActionFunction;
};

function CardDialog<TForm extends CardFormState>({
  formId,
  title,
  description,
  open,
  form,
  onFormChange,
  onClose,
  action,
}: CardDialogProps<TForm>) {
  return (
    <Dialog open={open} onClose={onClose} className='relative z-50'>
      <DialogBackdrop className='fixed inset-0 bg-neutral-foreground/30 dark:bg-neutral/30' />

      <div className='fixed inset-0 w-screen overflow-auto p-4'>
        <DialogPanel className='mx-auto mt-10 w-full max-w-lg rounded bg-background p-4 text-foreground md:p-8'>
          {/* HEADER */}
          <DialogTitle className='text-lg font-semibold capitalize text-accent text-shadow-2xs'>
            {title}
          </DialogTitle>

          {/* DESCRIPTION */}
          <Description className='text-sm text-muted-foreground text-shadow-2xs'>
            {description}
          </Description>

          {/* CARD FORM */}
          <FormContainer
            id={formId}
            className='mt-4 grid gap-3'
            action={action}
          >
            {/* INPUTS */}
            <TextInput
              id='title'
              label='title'
              placeholder='e.g. Personal goals'
              required
              value={form.title}
              onChange={(value) =>
                onFormChange((state) => ({ ...state, title: value }))
              }
            />
            <ColorInput
              label='color'
              name='color'
              value={form.color}
              onChange={(value) =>
                onFormChange((state) => ({ ...state, color: value }))
              }
            />

            {/* BUTTONS */}
            <div className='mt-4 flex justify-end gap-2'>
              <Button
                type='button'
                className='rounded border border-border px-3 py-1 font-semibold hover:cursor-pointer hover:bg-destructive/50 hover:text-shadow-2xs'
                onClick={onClose}
              >
                Cancel
              </Button>
              <SubmitButton
                text='Save'
                className='max-w-fit rounded border border-border px-3 py-1 hover:cursor-pointer hover:bg-successful/50 hover:text-shadow-2xs'
              />
            </div>
          </FormContainer>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default CardDialog;
