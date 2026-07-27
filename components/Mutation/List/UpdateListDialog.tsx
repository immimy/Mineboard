'use client';

import { useApolloClient } from '@apollo/client/react';
import { useBoardContext } from '@/components/BoardPage/BoardContext';
import {
  useUpdateListDialogActions,
  useUpdateListDialogState,
} from '@/components/Mutation/Context/UpdateListDialogContext';
import { useFragment as readFragment } from '@/gql/__generated__';
import { MutatedListFragmentDoc } from '@/gql/__generated__/graphql';
import { ActionFunction } from '@/types/app';
import { updateList } from '@/utils/actions/list';
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
  const { isOpen, listId, listFields, form } = useUpdateListDialogState();
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

      client.cache.writeFragment({
        id: client.cache.identify({
          __typename: 'lists',
          id: list.id,
        }),
        fragmentName: 'MutatedList',
        fragment: MutatedListFragmentDoc,
        data: list,
      });

      handleSuccessfulSave();

      return { error: null };
    } finally {
      savingRef.current = false;
    }
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
    />
  );
}

export default UpdateListDialog;
