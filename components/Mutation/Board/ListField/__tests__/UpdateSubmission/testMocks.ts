import {
  mockBoardId,
  mockDateId,
  mockTextId,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import {
  CachedBoardListsQuery,
  CachedListFieldsQuery,
  Field_Type,
} from '@/gql/__generated__/graphql';

export const existingTextDateListFields = {
  __typename: 'list_fieldsConnection',
  edges: [
    {
      __typename: 'list_fieldsEdge' as const,
      node: {
        __typename: 'list_fields' as const,
        id: mockTextId,
        type: Field_Type.Text,
        config: { title: 'Note' },
        position: 0,
      },
    },
    {
      __typename: 'list_fieldsEdge' as const,
      node: {
        __typename: 'list_fields' as const,
        id: mockDateId,
        type: Field_Type.Date,
        config: { title: 'Deadline', isIncludeTime: false },
        position: 1,
      },
    },
  ],
} satisfies NonNullable<CachedListFieldsQuery['list_fieldsCollection']>;

export const updatedTextDateListFields = {
  __typename: 'list_fieldsConnection',
  edges: [
    {
      __typename: 'list_fieldsEdge' as const,
      node: {
        __typename: 'list_fields' as const,
        id: mockTextId,
        type: Field_Type.Text,
        config: { title: 'Edited note' },
        position: 0,
      },
    },
    {
      __typename: 'list_fieldsEdge' as const,
      node: {
        __typename: 'list_fields' as const,
        id: mockDateId,
        type: Field_Type.Date,
        config: { title: 'Deadline', isIncludeTime: false },
        position: 1,
      },
    },
  ],
} satisfies NonNullable<CachedListFieldsQuery['list_fieldsCollection']>;

export const UPDATE_LIST_FIELDS_SUCCESS: {
  data: {
    listFields: CachedListFieldsQuery;
    boardLists: CachedBoardListsQuery;
  };
  error: null;
} = {
  error: null,
  data: {
    listFields: {
      __typename: 'Query',
      list_fieldsCollection: updatedTextDateListFields,
    },
    boardLists: {
      __typename: 'Query',
      cardsCollection: {
        __typename: 'cardsConnection',
        edges: [],
      },
    },
  },
};

export const UPDATE_LIST_FIELDS_FAIL = {
  data: null,
  error: 'Failed to update list fields',
};

export const cachedListFieldsVariables = { boardId: mockBoardId };
