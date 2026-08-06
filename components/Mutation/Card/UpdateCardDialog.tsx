'use client';

import { useApolloClient } from '@apollo/client/react';
import {
  useUpdateCardDialogActions,
  useUpdateCardDialogState,
} from '@/components/Mutation/Context/UpdateCardDialogContext';
import { updateCard } from '@/utils/actions/card';
import { deleteCards } from '@/utils/actions/card';
import { ActionFunction } from '@/types/app';
import CardDialog from './CardDialog';
import { renderError } from '@/components/global/utils';
import { useBoardContext } from '@/components/BoardPage/BoardContext';
import {
  CardsCollectionFragmentDoc,
  type SingleBoardQuery as SingleBoardQueryData,
  type SingleBoardQueryVariables,
} from '@/gql/__generated__/graphql';
import { useFragment as readFragment } from '@/gql/__generated__';
import { getSingleBoardQueryConfig, SingleBoardQuery } from '@/gql/queries';

function UpdateCardDialog() {
  const client = useApolloClient();

  const { boardId } = useBoardContext();
  const { isOpen, form } = useUpdateCardDialogState();
  const { closeUpdateCard, setForm } = useUpdateCardDialogActions();

  const handleCloseDialog = () => {
    closeUpdateCard();
  };

  // Update card action
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

  // Delete card action
  const handleDelete: ActionFunction = async () => {
    try {
      if (!form.cardId) return { error: 'Card is not selected' };

      const { error } = await deleteCards(boardId, [form.cardId]);
      if (error) return { error };

      client.cache.batch({
        update(cache) {
          const queryConfig = getSingleBoardQueryConfig(boardId);

          // Remove card from cardsCollection of `SingleBoardQuery` on ROOT_QUERY
          cache.updateQuery<SingleBoardQueryData, SingleBoardQueryVariables>(
            { query: SingleBoardQuery, variables: queryConfig.variables },
            (queryData) => {
              if (!queryData?.cardsCollection) return queryData;
              const existingEdges = readFragment(
                CardsCollectionFragmentDoc,
                queryData.cardsCollection,
              ).edges;
              return {
                ...queryData,
                cardsCollection: {
                  ...queryData.cardsCollection,
                  edges: existingEdges.filter(
                    ({ node }) => node.id !== form.cardId,
                  ),
                },
              };
            },
          );

          // Evict `cards:id` entity in the same transaction.
          cache.evict({
            id: cache.identify({
              __typename: 'cards',
              id: form.cardId,
            }),
          });
        },
      });

      client.cache.gc();
      handleCloseDialog();

      return { error: null };
    } catch (error) {
      return renderError(error, 'Failed to delete card');
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
      deleteAction={handleDelete}
    />
  );
}

export default UpdateCardDialog;
