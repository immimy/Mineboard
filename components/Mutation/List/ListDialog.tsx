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
import { ListFieldsCollectionFragment } from '@/gql/__generated__/graphql';
import { ActionFunction, ListForm } from '@/types/app';
import { ListFieldInput } from '@/types/jsonbSchema';
import RenderListInput from './ListInputs';

type ListDialogProps = {
  formId: string;
  title: string;
  description: string;
  open: boolean;
  ownerId?: string;
  listFields?: ListFieldsCollectionFragment['edges'];
  form: ListForm;
  onFieldChange: (fieldId: string, value: ListFieldInput) => void;
  onImageUpload?: (publicId: string) => void;
  onClose: () => void;
  action: ActionFunction;
  deleteAction?: ActionFunction;
};

function ListDialog({
  formId,
  title,
  description,
  open,
  ownerId,
  listFields,
  form,
  onFieldChange,
  onImageUpload,
  onClose,
  action,
  deleteAction,
}: ListDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className='relative z-50'>
      <DialogBackdrop className='fixed inset-0 bg-neutral-foreground/30 dark:bg-neutral/30' />

      <div className='fixed inset-0 w-screen overflow-auto p-4'>
        <DialogPanel className='mx-auto mt-10 w-full max-w-lg rounded bg-background p-4 text-foreground md:max-w-2xl md:p-8 lg:max-w-4xl'>
          {/* HEADER */}
          <DialogTitle className='text-lg font-semibold capitalize text-accent text-shadow-2xs'>
            {title}
          </DialogTitle>

          {/* DESCRIPTION */}
          <Description className='text-sm text-muted-foreground text-shadow-2xs'>
            {description}
          </Description>

          {/* LIST FORM */}
          <FormContainer id={formId} action={action}>
            {/* INPUTS */}
            <ul className='mt-4 grid gap-3 md:p-3'>
              {listFields?.map((edge) => {
                const field = edge.node;
                if (!form[field.id]) return null;
                return (
                  <RenderListInput
                    key={field.id}
                    field={field}
                    form={form[field.id]}
                    ownerId={ownerId}
                    handleFieldChange={onFieldChange}
                    handleImageUpload={onImageUpload}
                  />
                );
              })}
            </ul>

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
                formId={formId}
                className='max-w-fit rounded border border-border px-3 py-1 hover:cursor-pointer hover:bg-successful/50 hover:text-shadow-2xs'
              />
            </div>
          </FormContainer>

          {/* LIST DELETION */}
          {deleteAction && (
            <FormContainer action={deleteAction}>
              <SubmitButton className='mt-4 py-1 w-full rounded hover:cursor-pointer hover:bg-border/30 text-destructive font-medium tracking-wider min-h-8'>
                Delete List
              </SubmitButton>
            </FormContainer>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default ListDialog;
