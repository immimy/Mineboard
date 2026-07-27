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
import {
  requestImageCleanup,
  useImageUploadSession,
} from '@/hooks/image-cleanup';
import { useRef } from 'react';

function AddListDialog() {
  const client = useApolloClient();
  const savingRef = useRef(false);

  const { boardId, userId } = useBoardContext();
  const { isOpen, cardId, listFields, form } = useAddListDialogState();
  const { closeAddList, updateField } = useAddListDialogActions();
  const { trackUpload, discardSession, completeSession } =
    useImageUploadSession();

  // Close dialog & Reset form state & Image cleanup
  const handleCloseDialog = () => {
    // Guard request duplication
    if (savingRef.current) return;

    const discardedIds = discardSession();
    closeAddList();
    requestImageCleanup({ case: 'cancelled', discardedIds });
  };

  // Image status update & Image cleanup after success on save
  const handleSuccessfulSave = () => {
    const result = completeSession(form);
    closeAddList();
    requestImageCleanup({ case: 'saved', ...result });
  };

  // Create list with values form action
  const handleSave: ActionFunction = async () => {
    // Guard request duplication
    if (savingRef.current) return { error: null };

    if (!cardId) return { error: 'Card is not selected' };

    // Form validation: form contains value at least one field
    const isFormEmpty = isListFormEmpty(form);
    if (isFormEmpty) return { error: 'At least one field must have a value' };

    try {
      savingRef.current = true;

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

      // Image status update & Image cleanup
      handleSuccessfulSave();

      return { error: null };
    } catch (error) {
      return renderError(error, 'Failed to add list');
    } finally {
      savingRef.current = false;
    }
  };

  return (
    <ListDialog
      formId='add_list'
      title='Create list'
      description='Fill out the form and save your new list.'
      open={isOpen}
      ownerId={userId}
      listFields={listFields}
      form={form}
      onFieldChange={updateField}
      onImageUpload={trackUpload}
      onClose={handleCloseDialog}
      action={handleSave}
    />
  );
}
export default AddListDialog;
