'use client';

import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import {
  SubmitEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useBoardContext } from '@/components/Board/BoardContext';
import RenderListInput from '../ListInputs';
import {
  CreatedListFragmentDoc,
  Field_Type,
  ListFieldsCollectionFragment,
} from '@/gql/__generated__/graphql';
import { ListFieldData, ListFieldForm } from '@/types/app';
import {
  CheckboxSchema,
  DateInputSchema,
  ImageSchema,
  NumberSchema,
  TagSchema,
  TextSchema,
} from '@/types/jsonbSchema';
import { createList } from '@/utils/actions/list';
import { toast } from 'react-toastify';
import { useApolloClient } from '@apollo/client/react';
import { useFragment } from '@/gql/__generated__';

/** STATE */

function initState(
  dbListField: ListFieldsCollectionFragment['edges'][0]['node'],
) {
  switch (dbListField.type) {
    case Field_Type.Checkbox:
      return {
        value: { checked: false, title: '' },
      } as ListFieldData<CheckboxSchema>;

    case Field_Type.Date:
      return {
        value: '',
        meta: { tzOffset: new Date().getTimezoneOffset() },
      } as ListFieldData<DateInputSchema>;

    case Field_Type.Image:
      return { value: [] } as ListFieldData<ImageSchema>;

    case Field_Type.Number:
      return { value: '' } as ListFieldData<NumberSchema>;

    case Field_Type.Tag:
      return { value: [] } as ListFieldData<TagSchema>;

    case Field_Type.Text:
      return { value: '' } as ListFieldData<TextSchema>;
  }
}

function AddListDialog() {
  const client = useApolloClient();

  /** Board Context */
  const { boardId, dbListFields, isAddListOpen, closeAddList, addListCardId } =
    useBoardContext();

  /** Initial state */
  const initialState = useMemo(() => {
    return dbListFields?.reduce((acc, edge) => {
      const field = edge.node;
      acc[field.id] = initState(field);
      return acc;
    }, {} as ListFieldForm);
  }, [dbListFields]);
  /** Forms state */
  const [forms, setForms] = useState<ListFieldForm>({
    ...initialState,
  });

  /** Handle form change */
  const handleFieldChange = useCallback(
    (fieldId: string, value: ListFieldData) => {
      setForms((prevState) => ({ ...prevState, [fieldId]: value }));
    },
    [],
  );

  // Clear inputs when closing dialog
  useEffect(() => {
    if (!isAddListOpen) {
      setForms({ ...initialState });
    }
  }, [isAddListOpen, initialState]);

  // Create list with values
  const handleSave: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // Create list with values action
    const { data, error } = await createList(
      boardId,
      addListCardId as string,
      forms,
    );
    if (error) {
      toast.error(error);
      return;
    }

    // Apollo cache update
    const createdListEdge = data?.listsCollection?.edges[0].node;
    const createdList = useFragment(CreatedListFragmentDoc, createdListEdge!);

    // 1. Write Fragment
    const listRef = client.cache.writeFragment({
      fragmentName: 'createdList',
      fragment: CreatedListFragmentDoc,
      data: createdList,
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

    // Close AddListDialog
    closeAddList();
  };

  return (
    <Dialog open={isAddListOpen} onClose={closeAddList}>
      <div className='fixed inset-0 w-screen bg-neutral-foreground/10 p-4 overflow-auto'>
        <DialogPanel className='mx-auto mt-10 w-full max-w-lg md:max-w-2xl lg:max-w-4xl rounded bg-background text-foreground p-4 md:p-8'>
          {/* HEADER */}
          <DialogTitle className='text-lg font-semibold capitalize text-accent text-shadow-2xs'>
            Create list
          </DialogTitle>
          <Description className='text-sm text-muted-foreground text-shadow-2xs'>
            Fill out the form and save your new list.
          </Description>
          {/* LIST FIELD INPUTS */}
          <form id='add_list' onSubmit={handleSave}>
            <ul className='mt-4 grid gap-3 md:p-3'>
              {dbListFields?.map((edge) => {
                const field = edge.node;
                return (
                  <RenderListInput
                    key={field.id}
                    field={field}
                    form={forms[field.id]}
                    handleFieldChange={handleFieldChange}
                  />
                );
              })}
            </ul>
          </form>
          {/* BUTTONS */}
          <div className='mt-4 flex justify-end gap-2'>
            <Button
              type='button'
              className='rounded border border-border px-3 py-1 hover:bg-destructive/50 hover:cursor-pointer hover:text-shadow-2xs'
              onClick={closeAddList}
            >
              Cancel
            </Button>
            <Button
              form='add_list'
              type='submit'
              className='rounded border border-border px-3 py-1 hover:bg-successful/50 hover:cursor-pointer hover:text-shadow-2xs'
            >
              Save
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
export default AddListDialog;
