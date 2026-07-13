import {
  mockBoardId,
  mockDateId,
  mockListFields,
  mockTextId,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import * as BoardContext from '@/components/BoardPage/BoardContext';
import { makeFragmentData } from '@/gql/__generated__';
import {
  CachedListQuery,
  Field_Type,
  MutatedListFragmentDoc,
} from '@/gql/__generated__/graphql';
import type { MutatedListFragment } from '@/gql/__generated__/graphql';

export const mockedUseBoardContext = () => {
  vi.mocked(BoardContext.useBoardContext).mockReturnValue({
    boardId: mockBoardId,
    dbListFields: mockListFields.edges,
  });
};

const createdListValuesCollection: NonNullable<
  MutatedListFragment['list_valuesCollection']
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
          id: mockDateId,
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
          id: mockTextId,
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
  MutatedListFragmentDoc,
);
export const CREATE_LIST_SUCCESS: {
  data: CachedListQuery;
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
