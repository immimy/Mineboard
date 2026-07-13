'use client';

import { useApolloClient } from '@apollo/client/react';
import {
  useUpdateCardDialogActions,
  useUpdateCardDialogState,
} from '@/components/Mutation/Context/UpdateCardDialogContext';
import { updateCard } from '@/utils/actions/card';
import { ActionFunction } from '@/types/app';
import CardDialog from './CardDialog';
import { renderError } from '@/components/global/utils';

function UpdateCardDialog() {
  const client = useApolloClient();
  const { isOpen, form } = useUpdateCardDialogState();
  const { closeUpdateCard, setForm } = useUpdateCardDialogActions();

  const handleCloseDialog = () => {
    closeUpdateCard();
  };

  const handleSave: ActionFunction = async (_, formData) => {
    try {
      if (!form.cardId) return { error: 'Card is not selected' };

      formData.set('cardId', form.cardId);

      const { error } = await updateCard(formData);
      if (error) return { error };

      client.cache.modify({
        id: client.cache.identify({
          __typename: 'cards',
          id: form.cardId,
        }),
        fields: {
          title() {
            return form.title.trim();
          },
          color() {
            return form.color;
          },
        },
      });

      handleCloseDialog();

      return { error: null };
    } catch (error) {
      return renderError(error, 'Failed to update card');
    }
  };

  return (
    <CardDialog
      formId='update_card'
      title='Update card'
      description='Edit this card title and color.'
      open={isOpen}
      form={form}
      onFormChange={setForm}
      onClose={handleCloseDialog}
      action={handleSave}
    />
  );
}

export default UpdateCardDialog;
