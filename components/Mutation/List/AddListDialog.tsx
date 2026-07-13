'use client';

import { useBoardContext } from '@/components/BoardPage/BoardContext';
import {
  useAddListDialogActions,
  useAddListDialogState,
} from '@/components/Mutation/Context/AddListDialogContext';
import { MutatedListFragmentDoc } from '@/gql/__generated__/graphql';
import { ActionFunction } from '@/types/app';
import { createList } from '@/utils/actions/list';
import { useApolloClient } from '@apollo/client/react';
import { useFragment as readFragment } from '@/gql/__generated__';
import { isListFormEmpty } from '@/utils/validation/helper';
import ListDialog from './ListDialog';
import { renderError } from '@/components/global/utils';

function AddListDialog() {
  const client = useApolloClient();

  // Board context
  const { boardId } = useBoardContext();
  const { isOpen, cardId, listFields, form } = useAddListDialogState();
  const { closeAddList, updateField } = useAddListDialogActions();

  // Close dialog & Reset form state
  const handleCloseDialog = () => {
    closeAddList();
  };

  // Create list with values form action
  const handleSave: ActionFunction = async () => {
    try {
      if (!cardId) return { error: 'Card is not selected' };

      // Form validation: form contains value at least one field
      const isFormEmpty = isListFormEmpty(form);
      if (isFormEmpty) return { error: 'At least one field must have a value' };

      // Server: Create list with values
      const { data, error } = await createList(boardId, cardId, form);
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
          id: cardId,
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
    } catch (error) {
      return renderError(error, 'Failed to add list');
    }
  };

  return (
    <ListDialog
      formId='add_list'
      title='Create list'
      description='Fill out the form and save your new list.'
      open={isOpen}
      listFields={listFields}
      form={form}
      onFieldChange={updateField}
      onClose={handleCloseDialog}
      action={handleSave}
    />
  );
}
export default AddListDialog;
