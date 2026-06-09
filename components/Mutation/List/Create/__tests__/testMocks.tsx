import {
  mockBoardId,
  mockCardId,
  mockListFields,
} from '@/components/Board/__tests__/singleBoardQuery.mock';
import * as BoardContext from '@/components/Board/BoardContext';
import { makeFragmentData } from '@/gql/__generated__';
import {
  CreatedListFragmentDoc,
  Field_Type,
  ListWithValuesQuery,
} from '@/gql/__generated__/graphql';
import type { CreatedListFragment } from '@/gql/__generated__/graphql';

export const mockCloseAddList = vi.fn();
export const mockedUseBoardContext = () => {
  vi.mocked(BoardContext.useBoardContext).mockReturnValue({
    boardId: mockBoardId,
    dbListFields: mockListFields.edges,
    isAddCardOpen: false,
    openAddCard: vi.fn(),
    closeAddCard: vi.fn(),
    isAddListOpen: true,
    closeAddList: mockCloseAddList,
    addListCardId: mockCardId,
    openAddList: vi.fn(),
  });
};

const createdListValuesCollection: NonNullable<
  CreatedListFragment['list_valuesCollection']
> = {
  __typename: 'list_valuesConnection',
  edges: [
    {
      __typename: 'list_valuesEdge',
      node: {
        __typename: 'list_values',
        id: 'newValue1',
        value: '2026-12-24T6:00:00Z',
        list_fields: {
          __typename: 'list_fields',
          type: Field_Type.Date,
          config: { title: 'Deadline', isIncludeTime: false },
          position: 1,
        },
      },
    },
    {
      __typename: 'list_valuesEdge',
      node: {
        __typename: 'list_values',
        id: 'newValue2',
        value: 'Decorate Christmas tree',
        list_fields: {
          __typename: 'list_fields',
          type: Field_Type.Text,
          config: { title: 'Note' },
          position: 2,
        },
      },
    },
  ],
};
const createdListNode = makeFragmentData(
  {
    __typename: 'lists',
    id: 'newList',
    position: 1,
    list_valuesCollection: createdListValuesCollection,
  },
  CreatedListFragmentDoc,
);
export const CREATE_LIST_SUCCESS: {
  data: ListWithValuesQuery;
  error: null;
} = {
  error: null,
  data: {
    __typename: 'Query',
    listsCollection: {
      __typename: 'listsConnection',
      edges: [
        {
          __typename: 'listsEdge',
          node: { __typename: 'lists', ...createdListNode },
        },
      ],
    },
  },
};

export const CREATE_LIST_FAIL = {
  data: null,
  error: 'Failed to add list',
};
