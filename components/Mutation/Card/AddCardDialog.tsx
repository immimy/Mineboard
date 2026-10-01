'use client';

import { useApolloClient } from '@apollo/client/react';
import { useBoardContext } from '@/components/BoardPage/Board/BoardContext';
import { useLayoutMutationSync } from '@/components/BoardPage/Board/LayoutMutationSyncProvider';
import {
  useAddCardDialogActions,
  useAddCardDialogState,
} from '@/components/Mutation/Context/AddCardDialogContext';
import { createCard } from '@/utils/actions/card';
import { ActionFunction } from '@/types/app';
import { useFragment as readFragment } from '@/gql/__generated__';
import {
  CardsCollectionFragmentDoc,
  SingleBoardQuery as SingleBoardQueryData,
  SingleBoardQueryVariables,
} from '@/gql/__generated__/graphql';
import { getSingleBoardQueryConfig, SingleBoardQuery } from '@/gql/queries';
import CardDialog from './CardDialog';
import { renderError } from '@/components/global/utils';

function AddCardDialog() {
  const client = useApolloClient();
  const { runMutation } = useLayoutMutationSync();

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
    const result = await runMutation(boardId, async () => {
      try {
        // Set board id to form data
        formData.set('boardId', boardId);

        // Server: Create card
        const { data, error } = await createCard(formData);
        if (error || !data) return { error };

        const card = data.cardsCollection?.edges[0];
        if (!card) return { error: 'Created card was not returned' };

        // Update `SingleBoardQuery` by appending new card to the collection
        const queryConfig = getSingleBoardQueryConfig(boardId);
        client.cache.updateQuery<
          SingleBoardQueryData,
          SingleBoardQueryVariables
        >(
          {
            query: SingleBoardQuery,
            variables: queryConfig.variables,
          },
          (queryData) => {
            if (!queryData?.cardsCollection) return queryData;

            const existingEdges =
              readFragment(
                CardsCollectionFragmentDoc,
                queryData.cardsCollection,
              ).edges ?? [];

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

        return { error: null };
      } catch (error) {
        return renderError(error, 'Failed to add card');
      }
    });

    if (!result.error) handleCloseDialog();
    return result;
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
