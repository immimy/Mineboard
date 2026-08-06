import {
  AllBoardsQuery as AllBoardsQueryType,
  CachedBoardQuery,
} from '@/gql/__generated__/graphql';
import { AllBoardsQuery, getAllBoardsQueryConfig } from '@/gql/queries';

export const mockUserId = 'userId1';
export const mockExistingBoardId = 'boardId1';
export const mockCreatedBoardId = 'newBoard';

type BoardEdge = NonNullable<
  AllBoardsQueryType['boardsCollection']
>['edges'][number];
type CachedBoardEdge = NonNullable<
  CachedBoardQuery['boardsCollection']
>['edges'][number];

export const makeBoardEdge = (id: string, title: string) =>
  ({
    __typename: 'boardsEdge',
    node: {
      __typename: 'boards',
      id,
      title,
    },
  }) as BoardEdge & CachedBoardEdge;

export const existingBoardEdge = makeBoardEdge(
  mockExistingBoardId,
  'Website redesign',
);

export const createdBoardEdge = makeBoardEdge(
  mockCreatedBoardId,
  'Career roadmap',
);

export const allBoardsQueryVariables =
  getAllBoardsQueryConfig(mockUserId).variables;

export const allBoardsQueryOptions = {
  query: AllBoardsQuery,
  variables: allBoardsQueryVariables,
};

export const ALL_BOARDS_QUERY_DATA: AllBoardsQueryType = {
  __typename: 'Query',
  boardsCollection: {
    __typename: 'boardsConnection',
    edges: [existingBoardEdge],
  },
};

export const ALL_BOARDS_WITH_CREATED_BOARD_DATA: AllBoardsQueryType = {
  __typename: 'Query',
  boardsCollection: {
    __typename: 'boardsConnection',
    edges: [createdBoardEdge, existingBoardEdge],
  },
};

export const CREATE_BOARD_SUCCESS: {
  data: CachedBoardQuery;
  error: null;
} = {
  error: null,
  data: {
    __typename: 'Query',
    boardsCollection: {
      __typename: 'boardsConnection',
      edges: [createdBoardEdge],
    },
  },
};

export const CREATE_BOARD_EMPTY_EDGE: {
  data: CachedBoardQuery;
  error: null;
} = {
  error: null,
  data: {
    __typename: 'Query',
    boardsCollection: {
      __typename: 'boardsConnection',
      edges: [],
    },
  },
};

export const CREATE_BOARD_FAIL = {
  data: null,
  error: 'Failed to add board',
};
