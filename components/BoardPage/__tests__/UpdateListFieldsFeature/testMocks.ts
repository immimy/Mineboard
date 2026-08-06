import { makeFragmentData } from '@/gql/__generated__';
import {
  CachedBoardListsQuery,
  CachedListFieldsQuery,
  CachedListQuery,
  Field_Type,
  ListFragment,
  ListFragmentDoc,
  ListsCollectionFragment,
  ListValuesFragment,
  ListValuesFragmentDoc,
  MutatedListFragment,
  MutatedListFragmentDoc,
} from '@/gql/__generated__/graphql';
import { getSingleBoardQueryConfig, SingleBoardQuery } from '@/gql/queries';
import {
  mockBoardId,
  mockCardId,
  mockDateId,
  mockListFields,
  mockTagId,
  mockTextId,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { MockLink } from '@apollo/client/testing';

export const updatedTextFieldTitle = 'Summary';
export const addedNumberFieldId = 'updated-number-field';
const existingListId = 'listId1';
export const createdUpdatedListId = 'created-updated-list';
export const createdUpdatedTextValue = 'Use updated field config';
export const createdUpdatedNumberValue = '42';

const existingThreeListFieldsCollection = {
  __typename: 'list_fieldsConnection',
  edges: mockListFields.edges.filter(({ node }) =>
    [mockDateId, mockTextId, mockTagId].includes(node.id),
  ),
} satisfies NonNullable<CachedListFieldsQuery['list_fieldsCollection']>;

const updatedListFieldsCollection = {
  __typename: 'list_fieldsConnection',
  edges: [
    {
      __typename: 'list_fieldsEdge' as const,
      node: {
        __typename: 'list_fields' as const,
        id: mockDateId,
        type: Field_Type.Checkbox,
        config: {},
        position: 0,
      },
    },
    {
      __typename: 'list_fieldsEdge' as const,
      node: {
        __typename: 'list_fields' as const,
        id: mockTextId,
        type: Field_Type.Text,
        config: { title: updatedTextFieldTitle },
        position: 1,
      },
    },
    {
      __typename: 'list_fieldsEdge' as const,
      node: {
        __typename: 'list_fields' as const,
        id: addedNumberFieldId,
        type: Field_Type.Number,
        config: {
          title: 'Estimate',
          isHasUnit: false,
          unit: '',
          unitPosition: 'front',
        },
        position: 2,
      },
    },
  ],
} satisfies NonNullable<CachedListFieldsQuery['list_fieldsCollection']>;

const updatedTextValueNode = makeFragmentData(
  {
    __typename: 'list_values',
    id: 'two-field-text-value',
    value: 'Start with Atomic Habits',
    list_fields: {
      __typename: 'list_fields',
      id: mockTextId,
      type: Field_Type.Text,
      config: { title: updatedTextFieldTitle },
      position: 1,
    },
  } as ListValuesFragment,
  ListValuesFragmentDoc,
);

const updatedExistingListEdge = makeFragmentData(
  {
    __typename: 'listsEdge',
    node: {
      __typename: 'lists',
      id: existingListId,
      position: 0,
      list_valuesCollection: {
        __typename: 'list_valuesConnection',
        edges: [
          {
            __typename: 'list_valuesEdge',
            node: updatedTextValueNode,
          },
        ],
      },
    },
  } as ListFragment,
  ListFragmentDoc,
) as ListsCollectionFragment['edges'][number];

const updatedBoardLists: CachedBoardListsQuery = {
  __typename: 'Query',
  cardsCollection: {
    __typename: 'cardsConnection',
    edges: [
      {
        __typename: 'cardsEdge',
        node: {
          __typename: 'cards',
          id: mockCardId,
          listsCollection: {
            __typename: 'listsConnection',
            edges: [updatedExistingListEdge],
          },
        },
      },
    ],
  },
};

export const boardWithThreeListFieldsMock: MockLink.MockedResponse = {
  delay: 10,
  request: {
    query: SingleBoardQuery,
    variables: getSingleBoardQueryConfig(mockBoardId).variables,
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
              id: mockBoardId,
              title: 'Test Board',
            },
          },
        ],
      },
      list_fieldsCollection: existingThreeListFieldsCollection,
      cardsCollection: {
        __typename: 'cardsConnection',
        edges: [
          {
            __typename: 'cardsEdge',
            node: {
              __typename: 'cards',
              id: mockCardId,
              title: 'Test Card',
              position: 0,
              color: 1,
              listsCollection: {
                __typename: 'listsConnection',
                edges: [
                  {
                    __typename: 'listsEdge',
                    node: {
                      __typename: 'lists',
                      id: existingListId,
                      position: 0,
                      list_valuesCollection: {
                        __typename: 'list_valuesConnection',
                        edges: [
                          {
                            __typename: 'list_valuesEdge',
                            node: {
                              __typename: 'list_values',
                              id: 'two-field-date-value',
                              value: '2026-04-10T17:00:00Z',
                              list_fields: {
                                __typename: 'list_fields',
                                id: mockDateId,
                                type: Field_Type.Date,
                                config: {
                                  title: 'Deadline',
                                  isIncludeTime: false,
                                },
                                position: 0,
                              },
                            },
                          },
                          {
                            __typename: 'list_valuesEdge',
                            node: {
                              __typename: 'list_values',
                              id: 'two-field-text-value',
                              value: 'Start with Atomic Habits',
                              list_fields: {
                                __typename: 'list_fields',
                                id: mockTextId,
                                type: Field_Type.Text,
                                config: { title: 'Note' },
                                position: 1,
                              },
                            },
                          },
                          {
                            __typename: 'list_valuesEdge',
                            node: {
                              __typename: 'list_values',
                              id: 'three-field-tag-value',
                              value: [
                                { tag: 'reading', color: 3 },
                                { tag: 'research' },
                              ],
                              list_fields: {
                                __typename: 'list_fields',
                                id: mockTagId,
                                type: Field_Type.Tag,
                                config: { color: 3 },
                                position: 2,
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
};

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
      list_fieldsCollection: updatedListFieldsCollection,
    },
    boardLists: updatedBoardLists,
  },
};

export const UPDATE_LIST_FIELDS_FAIL = {
  data: null,
  error: 'Failed to update list fields',
};

const createdUpdatedListValuesCollection: NonNullable<
  MutatedListFragment['list_valuesCollection']
> = {
  __typename: 'list_valuesConnection',
  edges: [
    {
      __typename: 'list_valuesEdge',
      node: {
        __typename: 'list_values',
        id: 'created-updated-text-value',
        value: createdUpdatedTextValue,
        list_fields: {
          __typename: 'list_fields',
          id: mockTextId,
          type: Field_Type.Text,
          config: { title: updatedTextFieldTitle },
          position: 1,
        },
      },
    },
    {
      __typename: 'list_valuesEdge',
      node: {
        __typename: 'list_values',
        id: 'created-updated-number-value',
        value: createdUpdatedNumberValue,
        list_fields: {
          __typename: 'list_fields',
          id: addedNumberFieldId,
          type: Field_Type.Number,
          config: {
            title: 'Estimate',
            isHasUnit: false,
            unit: '',
            unitPosition: 'front',
          },
          position: 2,
        },
      },
    },
  ],
};

const createdUpdatedListNode = makeFragmentData(
  {
    __typename: 'lists',
    id: createdUpdatedListId,
    position: 1,
    list_valuesCollection: createdUpdatedListValuesCollection,
  },
  MutatedListFragmentDoc,
);

export const CREATE_LIST_WITH_UPDATED_FIELD_SUCCESS: {
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
          node: {
            __typename: 'lists',
            ...createdUpdatedListNode,
          },
        },
      ],
    },
  },
};
