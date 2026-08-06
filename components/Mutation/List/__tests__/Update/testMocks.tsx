import {
  mockCheckboxId,
  mockCardId,
  mockDateId,
  mockImageId,
  mockImageUrl,
  mockNumberId,
  mockTagId,
  mockTextId,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import type { UpdateListInput } from '@/components/Mutation/Context/types';
import { makeFragmentData } from '@/gql/__generated__';
import {
  CachedListQuery,
  Field_Type,
  MutatedListFragmentDoc,
} from '@/gql/__generated__/graphql';

export const mockListId = 'listId1';

export const initialUpdateListInput = {
  cardId: mockCardId,
  listId: mockListId,
  listValues: [
    {
      listFieldId: mockTextId,
      value: 'Start with Atomic Habits',
    },
    {
      listFieldId: mockNumberId,
      value: '8',
    },
  ],
} satisfies UpdateListInput;

export const secondUpdateListInput = {
  cardId: mockCardId,
  listId: 'listId2',
  listValues: [
    {
      listFieldId: mockTextId,
      value: 'Second list note',
    },
  ],
} satisfies UpdateListInput;

export const emptyUpdateListInput = {
  cardId: mockCardId,
  listId: mockListId,
  listValues: [
    {
      listFieldId: mockTextId,
      value: '',
    },
    {
      listFieldId: mockNumberId,
      value: '',
    },
  ],
} satisfies UpdateListInput;

export const missingListIdInput = {
  cardId: mockCardId,
  listId: '',
  listValues: [
    {
      listFieldId: mockTextId,
      value: 'No selected list',
    },
  ],
} satisfies UpdateListInput;

export const UPDATE_LIST_SUCCESS: { data: CachedListQuery; error: null } = {
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
            ...makeFragmentData(
              {
                __typename: 'lists',
                id: mockListId,
                position: 0,
                list_valuesCollection: {
                  __typename: 'list_valuesConnection',
                  edges: [
                    {
                      __typename: 'list_valuesEdge',
                      node: {
                        __typename: 'list_values',
                        id: 'value0',
                        value: { checked: true, title: 'Morning coffee' },
                        list_fields: {
                          __typename: 'list_fields',
                          id: mockCheckboxId,
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
                        id: 'value1',
                        value: '2026-04-10T17:00:00Z',
                        list_fields: {
                          __typename: 'list_fields',
                          id: mockDateId,
                          type: Field_Type.Date,
                          config: {
                            title: 'Deadline',
                            isIncludeTime: false,
                          },
                          position: 1,
                        },
                      },
                    },
                    {
                      __typename: 'list_valuesEdge',
                      node: {
                        __typename: 'list_values',
                        id: 'value2',
                        value: 'Read Clean Code',
                        list_fields: {
                          __typename: 'list_fields',
                          id: mockTextId,
                          type: Field_Type.Text,
                          config: { title: 'Note' },
                          position: 2,
                        },
                      },
                    },
                    {
                      __typename: 'list_valuesEdge',
                      node: {
                        __typename: 'list_values',
                        id: 'value3',
                        value: [
                          { tag: 'groceries', color: 3 },
                          { tag: 'errands' },
                        ],
                        list_fields: {
                          __typename: 'list_fields',
                          id: mockTagId,
                          type: Field_Type.Tag,
                          config: { color: 3 },
                          position: 3,
                        },
                      },
                    },
                    {
                      __typename: 'list_valuesEdge',
                      node: {
                        __typename: 'list_values',
                        id: 'value4',
                        value: [mockImageUrl],
                        list_fields: {
                          __typename: 'list_fields',
                          id: mockImageId,
                          type: Field_Type.Image,
                          config: { title: 'Cover' },
                          position: 4,
                        },
                      },
                    },
                    {
                      __typename: 'list_valuesEdge',
                      node: {
                        __typename: 'list_values',
                        id: 'value5',
                        value: 4,
                        list_fields: {
                          __typename: 'list_fields',
                          id: mockNumberId,
                          type: Field_Type.Number,
                          config: {
                            title: 'Estimate',
                            isHasUnit: true,
                            unit: 'hrs',
                            unitPosition: 'back',
                          },
                          position: 5,
                        },
                      },
                    },
                  ],
                },
              },
              MutatedListFragmentDoc,
            ),
          },
        },
      ],
    },
  },
};

export const UPDATE_LIST_FAIL = {
  data: null,
  error: 'Failed to update list',
};
