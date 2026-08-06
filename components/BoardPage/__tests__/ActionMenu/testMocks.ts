import { InMemoryCache } from '@apollo/client';
import { makeFragmentData } from '@/gql/__generated__';
import {
  BoardFragmentDoc,
  type AllBoardsQuery,
  type SingleBoardQuery,
} from '@/gql/__generated__/graphql';
import {
  AllBoardsQuery as AllBoardsQueryDocument,
  getAllBoardsQueryConfig,
  getSingleBoardQueryConfig,
  SingleBoardQuery as SingleBoardQueryDocument,
} from '@/gql/queries';
import { mockBoardId, successMock } from '../singleBoardQuery.mock';

export const mockUserId = 'userId1';
export const mockRemainingBoardId = 'boardId2';

export const singleBoardQueryConfig = getSingleBoardQueryConfig(mockBoardId);
export const allBoardsQueryConfig = getAllBoardsQueryConfig(mockUserId);

export const allBoardsQueryData = {
  __typename: 'Query',
  boardsCollection: {
    __typename: 'boardsConnection',
    edges: [
      {
        __typename: 'boardsEdge',
        node: {
          __typename: 'boards',
          id: mockBoardId,
        },
        ...makeFragmentData(
          {
            __typename: 'boardsEdge',
            node: {
              __typename: 'boards',
              id: mockBoardId,
              title: 'Test Board',
            },
          },
          BoardFragmentDoc,
        ),
      },
      {
        __typename: 'boardsEdge',
        node: {
          __typename: 'boards',
          id: mockRemainingBoardId,
        },
        ...makeFragmentData(
          {
            __typename: 'boardsEdge',
            node: {
              __typename: 'boards',
              id: mockRemainingBoardId,
              title: 'Second Board',
            },
          },
          BoardFragmentDoc,
        ),
      },
    ],
  },
} satisfies AllBoardsQuery;

export function createDeleteBoardCache() {
  const singleBoardResult = successMock.result;

  if (
    !singleBoardResult ||
    typeof singleBoardResult === 'function' ||
    !singleBoardResult.data
  ) {
    throw new Error('Expected static SingleBoard mock data');
  }

  const cache = new InMemoryCache();

  cache.writeQuery<SingleBoardQuery>({
    query: SingleBoardQueryDocument,
    variables: singleBoardQueryConfig.variables,
    data: singleBoardResult.data as SingleBoardQuery,
  });
  cache.writeQuery<AllBoardsQuery>({
    query: AllBoardsQueryDocument,
    variables: allBoardsQueryConfig.variables,
    data: allBoardsQueryData,
  });

  return cache;
}
