import type { ApolloClient, Reference, StoreObject } from '@apollo/client';
import type { BoardLayout } from './types';

/**
 * Updates `position` to reflect item order and `card_id` to reflect list
 * membership. Also keeps list connections in sync across cards so creation
 * and deletion cache updates continue to work consistently.
 *
 * Leaves connection array order untouched unless rebuilding list membership:
 * `createBoardData` derives the rendered order from `position`, not array order.
 */
export function updateBoardLayoutCache(
  cache: ApolloClient['cache'],
  layout: BoardLayout,
): void {
  cache.batch({
    update(cache) {
      layout.cardIds.forEach((cardId, cardPosition) => {
        const nextListIds = layout.listIdsByCard[cardId] ?? [];

        // Update cards cache
        cache.modify({
          id: cache.identify({ __typename: 'cards', id: cardId }),
          fields: {
            position: () => cardPosition,
            listsCollection(
              existing: StoreObject | Reference | null,
              { readField, toReference, isReference },
            ) {
              if (isReference(existing)) return existing;

              const edges = existing
                ? (readField<ReadonlyArray<StoreObject | Reference>>(
                    'edges',
                    existing,
                  ) ?? [])
                : [];
              const previousListIds = new Set(
                edges.map((edge) => {
                  const node = readField<StoreObject | Reference>(
                    'node',
                    edge,
                  )!;
                  return readField<string>('id', node);
                }),
              );
              const membershipChanged =
                previousListIds.size !== nextListIds.length ||
                nextListIds.some((id) => !previousListIds.has(id));
              if (!membershipChanged) return existing;

              // Only cross-card moves replace a connection's membership.
              return {
                ...existing,
                __typename: 'listsConnection',
                edges: nextListIds.map((id) => ({
                  __typename: 'listsEdge',
                  node: toReference({ __typename: 'lists', id })!,
                })),
              };
            },
          },
        });

        nextListIds.forEach((listId, listPosition) => {
          // Update lists cache
          cache.modify({
            id: cache.identify({ __typename: 'lists', id: listId }),
            fields: {
              card_id: () => cardId,
              position: () => listPosition,
            },
          });
        });
      });
    },
  });
}
