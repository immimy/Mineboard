import { useFragment as readFragment } from '@/gql/__generated__';
import {
  CardFragmentDoc,
  ListFragmentDoc,
  type CardsCollectionFragment,
} from '@/gql/__generated__/graphql';
import type { BoardData } from './types';

// Converts server data into the DnD-friendly shape
export function createBoardData(
  cards?: CardsCollectionFragment | null,
): BoardData {
  const cardIds: BoardData['layout']['cardIds'] = [];
  const listIdsByCard: BoardData['layout']['listIdsByCard'] = {};
  const cardQueries: BoardData['cardQueries'] = new Map();
  const listQueries: BoardData['listQueries'] = new Map();

  for (const edge of cards?.edges ?? []) {
    const card = readFragment(CardFragmentDoc, edge).node;

    cardIds.push(card.id);
    cardQueries.set(card.id, edge);
    listIdsByCard[card.id] = [];

    for (const listEdge of card.listsCollection?.edges ?? []) {
      const listId = readFragment(ListFragmentDoc, listEdge).node.id;
      listIdsByCard[card.id].push(listId);
      listQueries.set(listId, listEdge);
    }
  }

  return {
    layout: { cardIds, listIdsByCard },
    cardQueries,
    listQueries,
  };
}
