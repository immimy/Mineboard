'use client';

import { useApolloClient } from '@apollo/client/react';
import {
  InMemoryCache,
  type Reference,
  type StoreObject,
} from '@apollo/client';
import { useBoardContext } from '@/components/BoardPage/BoardContext';
import {
  useUpdateListDialogActions,
  useUpdateListDialogState,
} from '@/components/Mutation/Context/UpdateListDialogContext';
import { useFragment as readFragment } from '@/gql/__generated__';
import { MutatedListFragmentDoc } from '@/gql/__generated__/graphql';
import { ActionFunction } from '@/types/app';
import { updateList } from '@/utils/actions/list';
import { deleteList } from '@/utils/actions/list';
import { isListFormEmpty } from '@/utils/validation/helper';
import ListDialog from './ListDialog';
import {
  requestImageCleanup,
  useImageUploadSession,
} from '@/hooks/image-cleanup';
import { useRef } from 'react';

function UpdateListDialog() {
  const client = useApolloClient();
  const savingRef = useRef(false);

  const { boardId, userId } = useBoardContext();
  const { isOpen, cardId, listId, listFields, form } =
    useUpdateListDialogState();
  const { closeUpdateList, updateField } = useUpdateListDialogActions();
  const { trackUpload, discardSession, completeSession } =
    useImageUploadSession();

  const handleCloseDialog = () => {
    if (savingRef.current) return;

    const discardedIds = discardSession();
    closeUpdateList();
    requestImageCleanup({ case: 'cancelled', discardedIds });
  };

  const handleSuccessfulSave = () => {
    const result = completeSession(form);
    closeUpdateList();
    requestImageCleanup({ case: 'saved', ...result });
  };

  // Update list action
  const handleSave: ActionFunction = async () => {
    if (savingRef.current) return { error: null };

    if (!listId) return { error: 'List is not selected' };

    const isFormEmpty = isListFormEmpty(form);
    if (isFormEmpty) return { error: 'At least one field must have a value' };

    try {
      savingRef.current = true;

      const { data, error } = await updateList(boardId, listId, form);
      if (error || !data) return { error };

      const listNode = data.listsCollection?.edges[0].node;
      const list = readFragment(MutatedListFragmentDoc, listNode);
      if (!list)
        return { error: 'Failed to fetch updated list, please refresh' };

      const listRef = client.cache.writeFragment({
        id: client.cache.identify({
          __typename: 'lists',
          id: list.id,
        }),
        fragmentName: 'MutatedList',
        fragment: MutatedListFragmentDoc,
        data: list,
      });

      // Remove the list from Apollo's __META entry so GC can clean up orphaned cache data.
      if (listRef && client.cache instanceof InMemoryCache)
        client.cache.release(listRef.__ref);

      handleSuccessfulSave();

      return { error: null };
    } finally {
      savingRef.current = false;
    }
  };

  // Delete list action
  const handleDelete: ActionFunction = async () => {
    if (!cardId || !listId) return { error: 'List is not selected' };

    const { error } = await deleteList(cardId, listId);
    if (error) return { error };

    client.cache.batch({
      update(cache) {
        // Remove list from listsCollection of `cards:id` entity.
        cache.modify({
          id: cache.identify({ __typename: 'cards', id: cardId }),
          fields: {
            listsCollection(existing, { readField }) {
              if (!existing?.edges) return existing;

              return {
                ...existing,
                edges: existing.edges.filter(
                  (edge: { node: Reference | StoreObject }) =>
                    readField('id', edge.node) !== listId,
                ),
              };
            },
          },
        });

        // Evict `lists:id` entity in the same transaction.
        cache.evict({
          id: cache.identify({ __typename: 'lists', id: listId }),
        });
      },
    });
    client.cache.gc();

    // Cleanup Cloudinary images if exist
    const discardedIds = discardSession();
    closeUpdateList();
    requestImageCleanup({ case: 'cancelled', discardedIds });

    return { error: null };
  };

  return (
    <ListDialog
      formId='update_list'
      title='Update list'
      description='Edit the list values for this card.'
      open={isOpen}
      ownerId={userId}
      listFields={listFields}
      form={form}
      onFieldChange={updateField}
      onImageUpload={trackUpload}
      onClose={handleCloseDialog}
      action={handleSave}
      deleteAction={handleDelete}
    />
  );
}

export default UpdateListDialog;
