import { InMemoryCache } from '@apollo/client';
import {
  makeFragmentData,
  useFragment as readFragment,
} from '@/gql/__generated__';
import {
  CardsCollectionFragmentDoc,
  CardFragmentDoc,
  type CardsCollectionFragment,
  ListsCollectionFragmentDoc,
  type SingleBoardQuery,
} from '@/gql/__generated__/graphql';
import {
  getSingleBoardQueryConfig,
  SingleBoardQuery as SingleBoardQueryDocument,
} from '@/gql/queries';
import { mockBoardId } from './singleBoardQuery.mock';

export const mockSelectedCardIds = ['cardId1', 'cardId2'];

export const deleteActionSuccess = { error: null };
export const deleteCardsError = {
  data: null,
  error: 'Failed to delete selected cards',
};
export const deleteCardError = {
  data: null,
  error: 'Failed to delete card',
};
export const deleteListError = {
  data: null,
  error: 'Failed to delete list',
};

export const cardDeletionsQueryConfig = getSingleBoardQueryConfig(mockBoardId);

export function createCardDeletionsCache() {
  const cache = new InMemoryCache();
  const emptyLists = {
    __typename: 'listsConnection' as const,
    ...makeFragmentData(
      {
        __typename: 'listsConnection',
        edges: [],
      },
      ListsCollectionFragmentDoc,
    ),
  };
  const cardsCollection = makeFragmentData(
    {
      __typename: 'cardsConnection',
      edges: mockSelectedCardIds.map((id) => ({
        __typename: 'cardsEdge' as const,
        node: { __typename: 'cards' as const, id },
        ...makeFragmentData(
          {
            __typename: 'cardsEdge',
            node: {
              __typename: 'cards',
              id,
              title: id,
              position: 0,
              color: 1,
              listsCollection: emptyLists,
            },
          },
          CardFragmentDoc,
        ),
      })),
    } satisfies CardsCollectionFragment,
    CardsCollectionFragmentDoc,
  );

  cache.writeQuery<SingleBoardQuery>({
    query: SingleBoardQueryDocument,
    variables: cardDeletionsQueryConfig.variables,
    data: {
      __typename: 'Query',
      boardsCollection: null,
      list_fieldsCollection: null,
      cardsCollection: {
        __typename: 'cardsConnection',
        ...cardsCollection,
      },
    },
  });

  return cache;
}

export function readCachedCards(cache: InMemoryCache) {
  const queryData = cache.readQuery<SingleBoardQuery>({
    query: SingleBoardQueryDocument,
    variables: cardDeletionsQueryConfig.variables,
    returnPartialData: true,
  });

  return readFragment(CardsCollectionFragmentDoc, queryData?.cardsCollection);
}
