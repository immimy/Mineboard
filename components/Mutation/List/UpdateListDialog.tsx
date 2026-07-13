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

function UpdateListDialog() {
  const client = useApolloClient();
  const { boardId } = useBoardContext();
  const { isOpen, listId, listFields, form } = useUpdateListDialogState();
  const { closeUpdateList, updateField } = useUpdateListDialogActions();

  const handleCloseDialog = () => {
    closeUpdateList();
  };

  const handleSave: ActionFunction = async () => {
    if (!listId) return { error: 'List is not selected' };

    const isFormEmpty = isListFormEmpty(form);
    if (isFormEmpty) return { error: 'At least one field must have a value' };

    const { data, error } = await updateList(boardId, listId, form);
    if (error || !data) return { error };

    const listNode = data.listsCollection?.edges[0].node;
    const list = readFragment(MutatedListFragmentDoc, listNode);
    if (!list) return { error: 'Failed to fetch updated list, please refresh' };

    client.cache.writeFragment({
      id: client.cache.identify({
        __typename: 'lists',
        id: list.id,
      }),
      fragmentName: 'MutatedList',
      fragment: MutatedListFragmentDoc,
      data: list,
    });

    handleCloseDialog();

    return { error: null };
  };

  return (
    <ListDialog
      formId='update_list'
      title='Update list'
      description='Edit the list values for this card.'
      open={isOpen}
      listFields={listFields}
      form={form}
      onFieldChange={updateField}
      onClose={handleCloseDialog}
      action={handleSave}
    />
  );
}

export default UpdateListDialog;
