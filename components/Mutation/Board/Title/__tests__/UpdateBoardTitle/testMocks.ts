import { BoardTitleDocument } from '@/gql/__generated__/graphql';
import { gql } from '@apollo/client';

export const mockBoardId = 'boardId1';
export const mockBoardTitle = 'Test Board';
export const mockUpdatedBoardTitle = 'Career roadmap';

export const boardTitleFragment = gql`
  fragment UpdateBoardTitleTestBoard on boards {
    id
    title
  }
`;

export const boardTitleQueryOptions = {
  query: BoardTitleDocument,
  variables: { boardId: mockBoardId },
};

export const BOARD_TITLE_QUERY_DATA = {
  __typename: 'Query',
  boardsCollection: {
    __typename: 'boardsConnection',
    edges: [
      {
        __typename: 'boardsEdge',
        node: {
          __typename: 'boards',
          id: mockBoardId,
          title: mockBoardTitle,
        },
      },
    ],
  },
};

export const UPDATE_BOARD_TITLE_SUCCESS = {
  data: {
    __typename: 'boards' as const,
    id: mockBoardId,
    title: mockUpdatedBoardTitle,
  },
  error: null,
};

export const UPDATE_BOARD_TITLE_FAIL = {
  data: null,
  error: 'Failed to update board title',
};
