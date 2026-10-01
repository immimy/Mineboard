import { useFragment as readFragment } from '@/gql/__generated__';
import {
  CardFragmentDoc,
  ListFragmentDoc,
  type CardsCollectionFragment,
} from '@/gql/__generated__/graphql';
import type { BoardData } from './types';

/**
 * Converts server data into the DnD-friendly shape.
 *
 * — Item order comes from `position`, regardless of the cached array order.
 * — List membership comes from `card_id`, regardless of which card's nested
 * `listsCollection` contains the list. We still keep these connections in sync
 * during cross-card moves by updating the cache to move the list's reference
 * into the correct card's collection, preserving DnD stability and consistent
 * create/delete cache updates.
 */
export function createBoardData(
  cards?: CardsCollectionFragment | null,
): BoardData {
  // Layout for rendering
  const cardIds: BoardData['layout']['cardIds'] = [];
  const listIdsByCard: BoardData['layout']['listIdsByCard'] = {};
  // Queries for lookup
  const cardQueries: BoardData['cardQueries'] = new Map();
  const listQueries: BoardData['listQueries'] = new Map();

  for (const cardEdge of cards?.edges ?? []) {
    const card = readFragment(CardFragmentDoc, cardEdge).node;

    cardIds.push(card.id);
    if (!listIdsByCard[card.id]) listIdsByCard[card.id] = [];
    cardQueries.set(card.id, cardEdge);

    for (const listEdge of card.listsCollection?.edges ?? []) {
      const list = readFragment(ListFragmentDoc, listEdge).node;

      if (!listIdsByCard[list.card_id]) {
        listIdsByCard[list.card_id] = [list.id];
      } else {
        listIdsByCard[list.card_id].push(list.id);
      }
      listQueries.set(list.id, listEdge);
    }
  }

  // Sort only the new converted ID arrays that are used for rendering,
  // leaving cached edges and objects untouched.
  cardIds.sort(
    (a, b) =>
      readFragment(CardFragmentDoc, cardQueries.get(a)!).node.position -
      readFragment(CardFragmentDoc, cardQueries.get(b)!).node.position,
  );
  for (const listIds of Object.values(listIdsByCard)) {
    listIds.sort(
      (a, b) =>
        readFragment(ListFragmentDoc, listQueries.get(a)!).node.position -
        readFragment(ListFragmentDoc, listQueries.get(b)!).node.position,
    );
  }

  return {
    layout: { cardIds, listIdsByCard },
    cardQueries,
    listQueries,
  };
}
