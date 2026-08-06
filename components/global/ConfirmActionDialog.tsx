'use client';

// Use for confirmations that submit a Server Action or other network request.
// For synchronous, client-only confirmations, use ConfirmAlertDialog instead.

import { ActionFunction, FormState } from '@/types/app';
import {
  Button,
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Fieldset,
} from '@headlessui/react';
import React, { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SubmitButton from './SubmitButton';

const initialState: FormState = {
  error: null,
};

type ConfirmActionDialogProps = {
  isOpen: boolean;
  title?: string;
  description: string;
  confirmText?: string;
  onClose: () => void;
  onConfirm: ActionFunction;
} & React.PropsWithChildren;

function ConfirmActionDialog({
  children,
  isOpen,
  title = 'Confirm change',
  description,
  confirmText = 'Continue',
  onClose,
  onConfirm,
}: ConfirmActionDialogProps) {
  const handleConfirm: ActionFunction = async (formState, formData) => {
    const result = await onConfirm(formState, formData);
    if (!result.error) onClose();
    return result;
  };

  const [state, formAction, isPending] = useActionState(
    handleConfirm,
    initialState,
  );

  const handleClose = () => {
    if (!isPending) onClose();
  };

  useEffect(() => {
    if (!state.error) return;
    toast.error(state.error);
  }, [state]);

  return (
    <Dialog open={isOpen} onClose={handleClose} className='relative z-70'>
      <DialogBackdrop className='fixed inset-0 bg-neutral-foreground/40 dark:bg-neutral/50' />

      <div className='fixed inset-0 grid min-h-screen place-items-center p-4'>
        <DialogPanel className='w-full max-w-md rounded border border-border bg-background p-5 text-foreground shadow-lg'>
          {/* Title & Description */}
          <DialogTitle className='text-base font-semibold text-foreground'>
            {title}
          </DialogTitle>
          <Description className='mt-2 text-sm leading-6 text-muted-foreground'>
            {description}
          </Description>

          <form action={formAction}>
            <Fieldset disabled={isPending}>
              {/* OPTIONAL: Form Inputs */}
              <div className='hidden'>{children}</div>

              <div className='mt-6 flex justify-end gap-2'>
                {/* Cancel Button */}
                <Button
                  type='button'
                  onClick={handleClose}
                  className='min-h-10 rounded border border-border px-4 py-2 text-sm font-semibold text-muted-foreground outline-none transition hover:bg-muted hover:text-foreground data-focus:ring-2 data-focus:ring-accent/70 disabled:pointer-events-none'
                >
                  Cancel
                </Button>

                {/* Confirm Button: proceeds an action */}
                <SubmitButton
                  ariaLabel={confirmText}
                  className='min-h-10 rounded border border-destructive bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive outline-none transition hover:bg-destructive hover:text-background data-focus:ring-2 data-focus:ring-destructive/70 max-w-fit disabled:pointer-events-none'
                >
                  {confirmText}
                </SubmitButton>
              </div>
            </Fieldset>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default ConfirmActionDialog;
