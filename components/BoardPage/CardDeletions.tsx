'use client';

import { Button } from '@headlessui/react';
import { useCardDeletionsContext } from './CardDeletionsContext';
import ConfirmActionDialog from '../global/ConfirmActionDialog';
import { useState } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { useBoardContext } from './BoardContext';
import { deleteCards } from '@/utils/actions/card';
import {
  CardsCollectionFragmentDoc,
  type SingleBoardQuery as SingleBoardQueryData,
  type SingleBoardQueryVariables,
} from '@/gql/__generated__/graphql';
import { useFragment as readFragment } from '@/gql/__generated__';
import { getSingleBoardQueryConfig, SingleBoardQuery } from '@/gql/queries';
import type { ActionFunction } from '@/types/app';

function CardDeletions() {
  const client = useApolloClient();

  const { boardId } = useBoardContext();
  const { deletedCards, setDeleteMode } = useCardDeletionsContext();

  // Dialog State — Confirm Card Deletions
  const [isConfirmCardDeletionsOpen, setIsConfirmCardDeletionsOpen] =
    useState(false);

  // Delete cards action
  const handleDeleteCards: ActionFunction = async () => {
    const { error } = await deleteCards(boardId, [...deletedCards]);
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
                  ({ node }) => !deletedCards.has(node.id),
                ),
              },
            };
          },
        );

        // Evict `cards:id` entities in the same transaction so watchers only
        // receive the final collection and entity state.
        deletedCards.forEach((cardId) => {
          cache.evict({
            id: cache.identify({ __typename: 'cards', id: cardId }),
          });
        });
      },
    });

    client.cache.gc();
    setDeleteMode(false);

    return { error: null };
  };

  return (
    <>
      <div className='flex items-center justify-end gap-x-3 text-lg font-medium tracking-tighter'>
        <Button
          type='button'
          className='py-0.5 px-4 rounded text-muted-foreground hover:bg-border/50 hover:text-foreground hover:cursor-pointer'
          onClick={() => setDeleteMode(false)}
        >
          Cancel
        </Button>

        <Button
          type='button'
          onClick={() => setIsConfirmCardDeletionsOpen(true)}
          title='Select at least one card.'
          disabled={!deletedCards.size}
          className='py-0.5 px-4 rounded text-destructive/80 hover:bg-border/50 hover:text-destructive hover:cursor-pointer font-semibold disabled:cursor-not-allowed disabled:text-destructive/50 disabled:hover:bg-transparent'
        >
          Delete Cards
        </Button>
      </div>

      <ConfirmActionDialog
        isOpen={isConfirmCardDeletionsOpen}
        title='Confirm deletion'
        description='The deletion includes multiple cards. Confirm to proceed?'
        onClose={() => {
          setDeleteMode(false);
          setIsConfirmCardDeletionsOpen(false);
        }}
        onConfirm={handleDeleteCards}
      />
    </>
  );
}
export default CardDeletions;
