import { MockLink } from '@apollo/client/testing';
import { SingleBoardDocumentQuery } from '../BoardContainer';
import { GraphQLError } from 'graphql/error';
import { Field_Type } from '@/gql/__generated__/graphql';

// ─── IDs ──────────────────────────────────────────────────────────────────────

const BOARD_ID = 'boardId1';
const CARD_ID = 'cardId1';
const LIST_ID = 'listId1';

const FIELD_CHECKBOX_ID = 'field0';
const FIELD_DATE_ID = 'field1';
const FIELD_TEXT_ID = 'field2';
const FIELD_TAG_ID = 'field3';
const FIELD_IMAGE_ID = 'field4';
const FIELD_NUMBER_ID = 'field5';

const LV_CHECKBOX_ID = 'value0';
const LV_DATE_ID = 'value1';
const LV_TEXT_ID = 'value2';
const LV_TAG_ID = 'value3';
const LV_IMAGE_ID = 'value4';
const LV_NUMBER_ID = 'value5';

// ─── Mock ──────────────────────────────────────────────────────────────────────

export const mockPublicId = 'mock_public_id';
export const mockImageUrl =
  'https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?q=80&w=878&auto=format&fit=crop';

export const mockListFields = {
  __typename: 'list_fieldsConnection',
  edges: [
    {
      __typename: 'list_fieldsEdge' as const,
      node: {
        __typename: 'list_fields' as const,
        id: FIELD_CHECKBOX_ID,
        name: 'checkbox_1',
        type: Field_Type.Checkbox,
        config: {},
        position: 0,
      },
    },
    {
      __typename: 'list_fieldsEdge' as const,
      node: {
        __typename: 'list_fields' as const,
        id: FIELD_DATE_ID,
        name: 'date_1',
        type: Field_Type.Date,
        config: { title: 'Deadline', isIncludeTime: false },
        position: 1,
      },
    },
    {
      __typename: 'list_fieldsEdge' as const,
      node: {
        __typename: 'list_fields' as const,
        id: FIELD_TEXT_ID,
        name: 'text_1',
        type: Field_Type.Text,
        config: { title: 'Note' },
        position: 2,
      },
    },
    {
      __typename: 'list_fieldsEdge' as const,
      node: {
        __typename: 'list_fields' as const,
        id: FIELD_TAG_ID,
        name: 'tag_1',
        type: Field_Type.Tag,
        config: { color: 3 },
        position: 3,
      },
    },
    {
      __typename: 'list_fieldsEdge' as const,
      node: {
        __typename: 'list_fields' as const,
        id: FIELD_IMAGE_ID,
        name: 'image_1',
        type: Field_Type.Image,
        config: { title: 'Cover' },
        position: 4,
      },
    },
    {
      __typename: 'list_fieldsEdge' as const,
      node: {
        __typename: 'list_fields' as const,
        id: FIELD_NUMBER_ID,
        name: 'number_1',
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
  ],
};
export const successMock: MockLink.MockedResponse = {
  delay: 10,
  request: {
    query: SingleBoardDocumentQuery,
    variables: { boardId: BOARD_ID },
  },
  result: {
    data: {
      __typename: 'Query',

      // ── Board ──────────────────────────────────────────────────────────────
      boardsCollection: {
        __typename: 'boardsConnection',
        edges: [
          {
            __typename: 'boardsEdge',
            node: {
              __typename: 'boards',
              id: BOARD_ID,
              title: 'Test Board',
            },
          },
        ],
      },

      // ── List Fields (one per field_type enum value) ────────────────────────
      list_fieldsCollection: mockListFields,

      // ── Cards ──────────────────────────────────────────────────────────────
      cardsCollection: {
        __typename: 'cardsConnection',
        edges: [
          {
            __typename: 'cardsEdge',
            node: {
              __typename: 'cards',
              id: CARD_ID,
              title: 'Test Card',
              position: 0,
              color: 1, // color_palette domain (1–9)

              // ── Lists ───────────────────────────────────────────────────────
              listsCollection: {
                __typename: 'listsConnection',
                edges: [
                  {
                    __typename: 'listsEdge',
                    node: {
                      __typename: 'lists',
                      id: LIST_ID,
                      position: 0,

                      // ── List Values (all six field types) ───────────────────
                      list_valuesCollection: {
                        __typename: 'list_valuesConnection',
                        edges: [
                          // checkbox — value shape: { checked: boolean; title: string }
                          {
                            __typename: 'list_valuesEdge',
                            node: {
                              __typename: 'list_values',
                              id: LV_CHECKBOX_ID,
                              value: { checked: false, title: 'Mark as done' },
                              list_fields: {
                                __typename: 'list_fields',
                                type: 'checkbox',
                                config: {},
                                position: 0,
                              },
                            },
                          },

                          // date — value shape: ISO 8601 string
                          {
                            __typename: 'list_valuesEdge',
                            node: {
                              __typename: 'list_values',
                              id: LV_DATE_ID,
                              value: '2026-04-10T17:00:00Z',
                              list_fields: {
                                __typename: 'list_fields',
                                type: 'date',
                                config: {
                                  title: 'Deadline',
                                  isIncludeTime: false,
                                },
                                position: 1,
                              },
                            },
                          },

                          // text — value shape: string
                          {
                            __typename: 'list_valuesEdge',
                            node: {
                              __typename: 'list_values',
                              id: LV_TEXT_ID,
                              value: 'Start with Atomic Habits',
                              list_fields: {
                                __typename: 'list_fields',
                                type: 'text',
                                config: { title: 'Note' },
                                position: 2,
                              },
                            },
                          },

                          // tag — value shape: Array<{ tag: string; color?: number }>
                          {
                            __typename: 'list_valuesEdge',
                            node: {
                              __typename: 'list_values',
                              id: LV_TAG_ID,
                              value: [
                                { tag: 'groceries', color: 3 },
                                { tag: 'errands' },
                              ],
                              list_fields: {
                                __typename: 'list_fields',
                                type: 'tag',
                                config: { color: 3 },
                                position: 3,
                              },
                            },
                          },

                          // image — value shape: string[] (Cloudinary public IDs or URLs)
                          {
                            __typename: 'list_valuesEdge',
                            node: {
                              __typename: 'list_values',
                              id: LV_IMAGE_ID,
                              value: [mockImageUrl],
                              list_fields: {
                                __typename: 'list_fields',
                                type: 'image',
                                config: {
                                  title: 'Cover',
                                },
                                position: 4,
                              },
                            },
                          },

                          // number — value shape: number
                          {
                            __typename: 'list_valuesEdge',
                            node: {
                              __typename: 'list_values',
                              id: LV_NUMBER_ID,
                              value: 8,
                              list_fields: {
                                __typename: 'list_fields',
                                type: 'number',
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

export const noDataMock: MockLink.MockedResponse = {
  delay: 10,
  request: {
    query: SingleBoardDocumentQuery,
    variables: { boardId: BOARD_ID },
  },
  result: {
    data: {
      __typename: 'Query',

      // ── Board ──────────────────────────────────────────────────────────────
      boardsCollection: {
        __typename: 'boardsConnection',
        edges: [],
      },

      // ── List Fields (one per field_type enum value) ────────────────────────
      list_fieldsCollection: {
        __typename: 'list_fieldsConnection',
        edges: [],
      },

      // ── Cards ──────────────────────────────────────────────────────────────
      cardsCollection: {
        __typename: 'cardsConnection',
        edges: [],
      },
    },
  },
};

export const networkErrorMock: MockLink.MockedResponse = {
  delay: 10,
  request: {
    query: SingleBoardDocumentQuery,
    variables: { boardId: BOARD_ID },
  },
  error: new Error('Network failure'),
};

export const graphqlErrorMock: MockLink.MockedResponse = {
  delay: 10,
  request: {
    query: SingleBoardDocumentQuery,
    variables: { boardId: BOARD_ID },
  },
  result: {
    errors: [new GraphQLError('GraphQL failure')],
  },
};

export {
  BOARD_ID as mockBoardId,
  CARD_ID as mockCardId,
  FIELD_CHECKBOX_ID as mockCheckboxId,
  FIELD_DATE_ID as mockDateId,
  FIELD_TEXT_ID as mockTextId,
  FIELD_TAG_ID as mockTagId,
  FIELD_IMAGE_ID as mockImageId,
  FIELD_NUMBER_ID as mockNumberId,
};
