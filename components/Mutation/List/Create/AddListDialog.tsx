'use client';

import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { useCallback, useMemo, useState } from 'react';
import { useBoardContext } from '@/components/Board/BoardContext';
import RenderListInput from '../ListInputs';
import {
  CreatedListFragmentDoc,
  Field_Type,
  ListFieldsCollectionFragment,
} from '@/gql/__generated__/graphql';
import { ActionFunction, ListForm } from '@/types/app';
import {
  CheckboxInput,
  DateInput,
  ImageInput,
  ListFieldInput,
  NumberInput,
  TagInput,
  TextInput,
} from '@/types/jsonbSchema';
import { createList } from '@/utils/actions/list';
import { useApolloClient } from '@apollo/client/react';
import { useFragment as readFragment } from '@/gql/__generated__';
import FormContainer from '@/components/global/FormContainer';
import SubmitButton from '@/components/global/SubmitButton';
import { isListFormEmpty } from '@/utils/validation/helper';

function initFieldState(
  dbListField: ListFieldsCollectionFragment['edges'][0]['node'],
) {
  const initialState = { type: dbListField.type };
  switch (dbListField.type) {
    case Field_Type.Checkbox:
      return Object.assign(initialState, {
        value: { checked: false, title: '' },
        meta: { tzOffset: new Date().getTimezoneOffset() },
      }) as unknown as CheckboxInput;

    case Field_Type.Date:
      return Object.assign(initialState, {
        value: '',
        meta: { tzOffset: new Date().getTimezoneOffset() },
      } as unknown as DateInput);

    case Field_Type.Image:
      return Object.assign(initialState, {
        value: [],
      } as unknown as ImageInput);

    case Field_Type.Number:
      return Object.assign(initialState, {
        value: '',
      } as unknown as NumberInput);

    case Field_Type.Tag:
      return Object.assign(initialState, {
        value: [],
      } as unknown as TagInput);

    case Field_Type.Text:
      return Object.assign(initialState, {
        value: '',
      } as unknown as TextInput);
  }
}

function AddListDialog() {
  const client = useApolloClient();

  // Board context
  const { boardId, dbListFields, isAddListOpen, closeAddList, addListCardId } =
    useBoardContext();

  // Initial state
  const INITIAL_STATE = useMemo(() => {
    return dbListFields?.reduce((acc, edge) => {
      const field = edge.node;
      acc[field.id] = initFieldState(field);
      return acc;
    }, {} as ListForm);
  }, [dbListFields]);
  // Form state
  const [form, setForm] = useState<ListForm>({
    ...INITIAL_STATE,
  });

  // Handle form change
  const handleFieldChange = useCallback(
    (fieldId: string, value: ListFieldInput) => {
      setForm((prevState) => ({ ...prevState, [fieldId]: value }));
    },
    [],
  );

  // Close dialog & Reset form state
  const handleCloseDialog = () => {
    setForm({ ...INITIAL_STATE });
    closeAddList();
  };

  // Create list with values form action
  const handleSave: ActionFunction = async () => {
    // Form validation: form contains value at least one field
    const isFormEmpty = isListFormEmpty(form);
    if (isFormEmpty) return { error: 'At least one field must have a value' };

    // Server: Create list with values
    const { data, error } = await createList(
      boardId,
      addListCardId as string,
      form,
    );
    if (error || !data) return { error };

    // Apollo cache update
    const listEdge = data.listsCollection?.edges[0].node;
    const list = readFragment(CreatedListFragmentDoc, listEdge!);

    // 1. Write fragment
    const listRef = client.cache.writeFragment({
      fragmentName: 'CreatedList',
      fragment: CreatedListFragmentDoc,
      data: list,
    });

    // 2. Cache modify
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
    <Dialog open={isAddListOpen} onClose={handleCloseDialog}>
      <div className='fixed inset-0 w-screen bg-neutral-foreground/10 p-4 overflow-auto'>
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
                return (
                  <RenderListInput
                    key={field.id}
                    field={field}
                    form={form[field.id]}
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
                formId='add_list'
                className='rounded border border-border px-3 py-1 hover:bg-successful/50 hover:cursor-pointer hover:text-shadow-2xs max-w-fit'
              >
                Save
              </SubmitButton>
            </div>
          </FormContainer>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
export default AddListDialog;
