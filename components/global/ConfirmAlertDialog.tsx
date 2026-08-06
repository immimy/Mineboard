'use client';

// Use for synchronous, client-only confirmations. For actions that send a
// network request, use ConfirmActionDialog so form status protects submission.

import {
  Button,
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

type ConfirmAlertDialogProps = {
  isOpen: boolean;
  title?: string;
  description: string;
  confirmText?: string;
  onClose: () => void;
  onConfirm: () => void;
};

function ConfirmAlertDialog({
  isOpen,
  title = 'Confirm change',
  description,
  confirmText = 'Continue',
  onClose,
  onConfirm,
}: ConfirmAlertDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-70'>
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

          <div className='mt-6 flex justify-end gap-2'>
            {/* Cancel Button */}
            <Button
              type='button'
              onClick={onClose}
              className='min-h-10 rounded border border-border px-4 py-2 text-sm font-semibold text-muted-foreground outline-none transition hover:bg-muted hover:text-foreground data-focus:ring-2 data-focus:ring-accent/70'
            >
              Cancel
            </Button>
            {/* Confirm Button: proceeds an action */}
            <Button
              type='button'
              onClick={handleConfirm}
              className='min-h-10 rounded border border-destructive bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive outline-none transition hover:bg-destructive hover:text-background data-focus:ring-2 data-focus:ring-destructive/70'
            >
              {confirmText}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default ConfirmAlertDialog;
