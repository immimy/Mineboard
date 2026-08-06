import { AllBoardsQuery, getAllBoardsQueryConfig } from '@/gql/queries';
import { MockLink } from '@apollo/client/testing';
import { GraphQLError } from 'graphql/error';

const USER_ID = 'userId1';
const BOARD_ID_1 = 'boardId1';
const BOARD_ID_2 = 'boardId2';
const queryConfig = getAllBoardsQueryConfig(USER_ID);

export const successMock: MockLink.MockedResponse = {
  delay: 10,
  request: {
    query: AllBoardsQuery,
    variables: queryConfig.variables,
  },
  result: {
    data: {
      __typename: 'Query',
      boardsCollection: {
        __typename: 'boardsConnection',
        edges: [
          {
            __typename: 'boardsEdge',
            node: {
              __typename: 'boards',
              id: BOARD_ID_1,
              title: 'Website redesign',
            },
          },
          {
            __typename: 'boardsEdge',
            node: {
              __typename: 'boards',
              id: BOARD_ID_2,
              title: 'Personal to-do',
            },
          },
        ],
      },
    },
  },
};

export const noDataMock: MockLink.MockedResponse = {
  delay: 10,
  request: {
    query: AllBoardsQuery,
    variables: queryConfig.variables,
  },
  result: {
    data: {
      __typename: 'Query',
      boardsCollection: {
        __typename: 'boardsConnection',
        edges: [],
      },
    },
  },
};

export const networkErrorMock: MockLink.MockedResponse = {
  delay: 10,
  request: {
    query: AllBoardsQuery,
    variables: queryConfig.variables,
  },
  error: new Error('Network failure'),
};

export const graphqlErrorMock: MockLink.MockedResponse = {
  delay: 10,
  request: {
    query: AllBoardsQuery,
    variables: queryConfig.variables,
  },
  result: {
    errors: [new GraphQLError('GraphQL failure')],
  },
};

export { USER_ID as mockUserId };
