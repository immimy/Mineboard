'use client';

import { useApolloClient } from '@apollo/client/react';
import { useBoardContext } from '@/components/BoardPage/BoardContext';
import {
  useAddCardDialogActions,
  useAddCardDialogState,
} from '@/components/Mutation/Context/AddCardDialogContext';
import { createCard } from '@/utils/actions/card';
import { ActionFunction } from '@/types/app';
import { useFragment as readFragment } from '@/gql/__generated__';
import {
  CardsCollectionFragmentDoc,
  SingleBoardDocument,
  SingleBoardQuery,
  SingleBoardQueryVariables,
} from '@/gql/__generated__/graphql';
import CardDialog from './CardDialog';
import { renderError } from '@/components/global/utils';

function AddCardDialog() {
  const client = useApolloClient();

  // Consume context
  const { boardId } = useBoardContext();
  const { isOpen, form } = useAddCardDialogState();
  const { closeAddCard, setForm } = useAddCardDialogActions();

  // Close dialog & Reset form state
  const handleCloseDialog = () => {
    closeAddCard();
  };

  // Create card form action
  const handleSave: ActionFunction = async (_, formData) => {
    try {
      // Set board id to form data
      formData.set('boardId', boardId);

      // Server: Create card
      const { data, error } = await createCard(formData);
      if (error || !data) return { error };

      const card = data.cardsCollection?.edges[0];
      if (!card) return { error: 'Created card was not returned' };

      // Update `SingleBoardQuery` by appending new card to the collection
      client.cache.updateQuery<SingleBoardQuery, SingleBoardQueryVariables>(
        {
          query: SingleBoardDocument,
          variables: { boardId },
        },
        (queryData) => {
          if (!queryData?.cardsCollection) return queryData;

          const existingEdges =
            readFragment(CardsCollectionFragmentDoc, queryData.cardsCollection)
              .edges ?? [];

          const cardExists = existingEdges.some(
            (edge) => edge.node.id === card.node.id,
          );
          if (cardExists) return queryData;

          return {
            ...queryData,
            cardsCollection: {
              ...queryData.cardsCollection,
              edges: [...existingEdges, card],
            },
          };
        },
      );

      handleCloseDialog();
      return { error: null };
    } catch (error) {
      return renderError(error, 'Failed to add card');
    }
  };

  return (
    <CardDialog
      formId='add_card'
      title='Create card'
      description='Add a new card to this board.'
      open={isOpen}
      form={form}
      onFormChange={setForm}
      onClose={handleCloseDialog}
      action={handleSave}
    />
  );
}
export default AddCardDialog;
