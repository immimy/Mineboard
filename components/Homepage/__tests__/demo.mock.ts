import {
  type DemoHomepageQuery,
  Field_Type,
} from '@/gql/__generated__/graphql';
import { ColorPalette } from '@/types/jsonbSchema';

export const weeklyResetBoardId = '10000000-0000-4000-8000-000000000001';
export const travelWishlistBoardId = '10000000-0000-4000-8000-000000000002';

export const demoHomepageQuery: DemoHomepageQuery = {
  __typename: 'Query',
  boardsCollection: {
    __typename: 'boardsConnection',
    edges: [
      {
        __typename: 'boardsEdge',
        node: {
          __typename: 'boards',
          id: weeklyResetBoardId,
          title: 'Weekly Reset',
          list_fieldsCollection: {
            __typename: 'list_fieldsConnection',
            edges: [
              {
                __typename: 'list_fieldsEdge',
                node: {
                  __typename: 'list_fields',
                  id: '20000000-0000-4000-8000-000000000001',
                  type: Field_Type.Text,
                  config: { title: 'Focus' },
                  position: 0,
                },
              },
            ],
          },
          cardsCollection: {
            __typename: 'cardsConnection',
            edges: [
              {
                __typename: 'cardsEdge',
                node: {
                  __typename: 'cards',
                  id: '30000000-0000-4000-8000-000000000001',
                  title: 'Sunday routine',
                  color: ColorPalette.sixth,
                  position: 0,
                  listsCollection: {
                    __typename: 'listsConnection',
                    edges: [
                      {
                        __typename: 'listsEdge',
                        node: {
                          __typename: 'lists',
                          id: '40000000-0000-4000-8000-000000000001',
                          position: 0,
                          list_valuesCollection: {
                            __typename: 'list_valuesConnection',
                            edges: [
                              {
                                __typename: 'list_valuesEdge',
                                node: {
                                  __typename: 'list_values',
                                  id: '50000000-0000-4000-8000-000000000001',
                                  value: 'Prepare the week calmly',
                                  list_fields: {
                                    __typename: 'list_fields',
                                    id: '20000000-0000-4000-8000-000000000001',
                                    type: Field_Type.Text,
                                    config: { title: 'Focus' },
                                    position: 0,
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
      {
        __typename: 'boardsEdge',
        node: {
          __typename: 'boards',
          id: travelWishlistBoardId,
          title: 'Travel Wishlist',
          list_fieldsCollection: {
            __typename: 'list_fieldsConnection',
            edges: [],
          },
          cardsCollection: {
            __typename: 'cardsConnection',
            edges: [],
          },
        },
      },
    ],
  },
} as unknown as DemoHomepageQuery;
