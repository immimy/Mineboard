import {
  AllBoardsQuery as AllBoardsQueryType,
  CachedBoardQuery,
} from '@/gql/__generated__/graphql';
import { AllBoardsQuery, getAllBoardsQueryConfig } from '@/gql/queries';
import { GraphQLError } from 'graphql/error';

export const mockUserId = 'userId1';
export const existingBoardId = 'boardId1';
export const secondBoardId = 'boardId2';
export const createdBoardId = 'newBoard';

type BoardEdge = NonNullable<
  AllBoardsQueryType['boardsCollection']
>['edges'][number];
type CachedBoardEdge = NonNullable<
  CachedBoardQuery['boardsCollection']
>['edges'][number];

const makeBoardEdge = (id: string, title: string) =>
  ({
    __typename: 'boardsEdge',
    node: {
      __typename: 'boards',
      id,
      title,
    },
  }) as BoardEdge & CachedBoardEdge;

const existingBoardEdge = makeBoardEdge(existingBoardId, 'Website redesign');
const secondBoardEdge = makeBoardEdge(secondBoardId, 'Personal to-do');
const createdBoardEdge = makeBoardEdge(createdBoardId, 'Career roadmap');

const allBoardsQueryRequest = {
  query: AllBoardsQuery,
  variables: getAllBoardsQueryConfig(mockUserId).variables,
};

const makeBoardsData = (edges: BoardEdge[]): AllBoardsQueryType => ({
  __typename: 'Query',
  boardsCollection: {
    __typename: 'boardsConnection',
    edges,
  },
});

export const successMock = {
  delay: 10,
  request: allBoardsQueryRequest,
  result: {
    data: makeBoardsData([existingBoardEdge, secondBoardEdge]),
  },
};

export const loadingMock = {
  delay: 60_000,
  request: allBoardsQueryRequest,
  result: {
    data: makeBoardsData([existingBoardEdge, secondBoardEdge]),
  },
};

export const noBoardsMock = {
  delay: 10,
  request: allBoardsQueryRequest,
  result: {
    data: makeBoardsData([]),
  },
};

export const graphqlErrorMock = {
  delay: 10,
  request: allBoardsQueryRequest,
  result: {
    errors: [new GraphQLError('Failed to load boards')],
  },
};

export const createBoardSuccess: { data: CachedBoardQuery; error: null } = {
  error: null,
  data: {
    __typename: 'Query',
    boardsCollection: {
      __typename: 'boardsConnection',
      edges: [createdBoardEdge],
    },
  },
};
