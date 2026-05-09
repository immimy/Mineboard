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
  ListValuesCollectionFragmentDoc,
  ListWithValuesDocumentQuery,
} from '@/gql/__generated__/graphql';

export const mockCloseAddList = vi.fn();
export const mockedUseBoardContext = () => {
  vi.mocked(BoardContext.useBoardContext).mockReturnValue({
    boardId: mockBoardId,
    dbListFields: mockListFields.edges,
    isAddListOpen: true,
    closeAddList: mockCloseAddList,
    addListCardId: mockCardId,
    openAddList: vi.fn(),
  });
};

const createdListValuesCollection = makeFragmentData(
  {
    __typename: 'list_valuesConnection',
    edges: [
      {
        __typename: 'list_valuesEdge',
        node: {
          __typename: 'list_values',
          id: 'newValue1',
          value: { checked: false, title: 'write daily journal' },
          list_fields: {
            __typename: 'list_fields',
            type: Field_Type.Checkbox,
            config: {},
            position: 0,
          },
        },
      },
      {
        __typename: 'list_valuesEdge',
        node: {
          __typename: 'list_values',
          id: 'newValue2',
          value: [{ tag: 'routine' }],
          list_fields: {
            __typename: 'list_fields',
            type: Field_Type.Tag,
            config: { color: 3 },
            position: 3,
          },
        },
      },
    ],
  },
  ListValuesCollectionFragmentDoc,
);
const createdListNode = makeFragmentData(
  {
    __typename: 'lists',
    id: 'newList',
    position: 0,
    list_valuesCollection: {
      __typename: 'list_valuesConnection',
      ...createdListValuesCollection,
    },
  },
  CreatedListFragmentDoc,
);
export const CREATE_LIST_SUCCESS: {
  data: ListWithValuesDocumentQuery;
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
