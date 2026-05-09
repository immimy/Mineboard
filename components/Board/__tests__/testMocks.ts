import { makeFragmentData } from '@/gql/__generated__';
import {
  CreatedListFragmentDoc,
  Field_Type,
  ListValuesCollectionFragmentDoc,
  ListWithValuesDocumentQuery,
} from '@/gql/__generated__/graphql';

const createdListValuesCollection = makeFragmentData(
  {
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
  },
  ListValuesCollectionFragmentDoc,
);
const createdListNode = makeFragmentData(
  {
    __typename: 'lists',
    id: 'newList',
    position: 1,
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
