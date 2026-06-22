'use client';

import {
  Button,
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { useCallback, useMemo, useState } from 'react';
import { useBoardContext } from '@/components/BoardPage/BoardContext';
import RenderListInput from '../ListInputs';
import { MutatedListFragmentDoc } from '@/gql/__generated__/graphql';
import { ActionFunction, ListForm } from '@/types/app';
import { ListFieldInput } from '@/types/jsonbSchema';
import { createList } from '@/utils/actions/list';
import { useApolloClient } from '@apollo/client/react';
import { useFragment as readFragment } from '@/gql/__generated__';
import FormContainer from '@/components/global/FormContainer';
import SubmitButton from '@/components/global/SubmitButton';
import { isListFormEmpty } from '@/utils/validation/helper';
import { initFormState } from './utils';

function AddListDialog() {
  const client = useApolloClient();

  // Board context
  const { boardId, dbListFields, isAddListOpen, closeAddList, addListCardId } =
    useBoardContext();

  // Initial state
  const initialForm = useMemo(
    () => initFormState(dbListFields),
    [dbListFields],
  );
  // Form state: only reflects to user edits
  const [form, setForm] = useState<ListForm>({});
  // Active form: reflects to both user edits and list fields changes
  // —— REMINDER ——: useState only initializes on the first render and keeps the state value internally; It's does not reinitialize when re-rendering.
  // —— BugFix ——: Form state does not reflect to the current list fields change, that leads to list creation error.
  // This active is derived from the latest list fields while preserving values the user already typed.
  const activeForm = useMemo(
    () => ({ ...initialForm, ...form }),
    [form, initialForm],
  );

  // Handle form change
  const handleFieldChange = useCallback(
    (fieldId: string, value: ListFieldInput) => {
      setForm((prevState) => ({ ...prevState, [fieldId]: value }));
    },
    [],
  );

  // Close dialog & Reset form state
  const handleCloseDialog = () => {
    setForm(initialForm);
    closeAddList();
  };

  // Create list with values form action
  const handleSave: ActionFunction = async () => {
    // Form validation: form contains value at least one field
    const isFormEmpty = isListFormEmpty(activeForm);
    if (isFormEmpty) return { error: 'At least one field must have a value' };

    // Server: Create list with values
    const { data, error } = await createList(
      boardId,
      addListCardId as string,
      activeForm,
    );
    if (error || !data) return { error };

    // Apollo cache update
    const listNode = data.listsCollection?.edges[0].node;
    const list = readFragment(MutatedListFragmentDoc, listNode);
    if (!list) return { error: 'Failed to fetch new list, please refresh' };

    // 1. Write fragment reference
    const listRef = client.cache.writeFragment({
      fragmentName: 'MutatedList',
      fragment: MutatedListFragmentDoc,
      data: list,
    });

    // 2. Modify normalized cache
    client.cache.modify({
      id: client.cache.identify({
        __typename: 'cards',
        id: addListCardId,
      }),
      fields: {
        listsCollection(
          existingConnection = { __typename: 'listsConnection', edges: [] },
        ) {
          const nextEdge = {
            __typename: 'listsEdge',
            node: listRef,
          };
          return {
            ...existingConnection,
            edges: [...existingConnection.edges, nextEdge],
          };
        },
      },
    });

    handleCloseDialog();

    return { error: null };
  };

  return (
    <Dialog
      open={isAddListOpen}
      onClose={handleCloseDialog}
      className='relative z-50'
    >
      <DialogBackdrop className='fixed inset-0 bg-neutral-foreground/30 dark:bg-neutral/30' />
      <div className='fixed inset-0 w-screen p-4 overflow-auto'>
        <DialogPanel className='mx-auto mt-10 w-full max-w-lg md:max-w-2xl lg:max-w-4xl rounded bg-background text-foreground p-4 md:p-8'>
          {/* HEADER */}
          <DialogTitle className='text-lg font-semibold capitalize text-accent text-shadow-2xs'>
            Create list
          </DialogTitle>
          <Description className='text-sm text-muted-foreground text-shadow-2xs'>
            Fill out the form and save your new list.
          </Description>
          {/* ADD LIST FORM */}
          <FormContainer id='add_list' action={handleSave}>
            <ul className='mt-4 grid gap-3 md:p-3'>
              {dbListFields?.map((edge) => {
                const field = edge.node;
                if (!activeForm[field.id]) return null;
                return (
                  <RenderListInput
                    key={field.id}
                    field={field}
                    form={activeForm[field.id]}
                    handleFieldChange={handleFieldChange}
                  />
                );
              })}
            </ul>
            {/* BUTTONS */}
            <div className='mt-4 flex justify-end gap-2'>
              <Button
                type='button'
                className='rounded border border-border px-3 py-1 hover:bg-destructive/50 hover:cursor-pointer hover:text-shadow-2xs font-semibold'
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <SubmitButton
                text='Save'
                formId='add_list'
                className='rounded border border-border px-3 py-1 hover:bg-successful/50 hover:cursor-pointer hover:text-shadow-2xs max-w-fit'
              />
            </div>
          </FormContainer>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
export default AddListDialog;
