import { makeFragmentData } from '@/gql/__generated__';
import {
  CachedCardQuery,
  CachedListFieldsQuery,
  CachedListQuery,
  Field_Type,
  MutatedListFragment,
  MutatedListFragmentDoc,
} from '@/gql/__generated__/graphql';
import { getSingleBoardQueryConfig, SingleBoardQuery } from '@/gql/queries';
import { ColorPalette } from '@/types/jsonbSchema';
import { MockLink } from '@apollo/client/testing';
import { mockBoardId } from '../singleBoardQuery.mock';

export const createdTextFieldId = 'created-text-field';
export const createdCardId = 'created-card';
export const createdListId = 'created-list';

const boardEdge = {
  __typename: 'boardsEdge',
  node: {
    __typename: 'boards',
    id: mockBoardId,
    title: 'Test Board',
  },
};

const createdTextFieldEdge = {
  __typename: 'list_fieldsEdge',
  node: {
    __typename: 'list_fields',
    id: createdTextFieldId,
    type: Field_Type.Text,
    config: { title: 'Note' },
    position: 0,
  },
} satisfies NonNullable<
  CachedListFieldsQuery['list_fieldsCollection']
>['edges'][number];

const emptyCardsCollection = {
  __typename: 'cardsConnection',
  edges: [],
};

const emptyListFieldsCollection = {
  __typename: 'list_fieldsConnection',
  edges: [],
};

const createdTextListFieldsCollection: NonNullable<
  CachedListFieldsQuery['list_fieldsCollection']
> = {
  __typename: 'list_fieldsConnection',
  edges: [createdTextFieldEdge],
};

const makeSingleBoardMock = (data: {
  cardsCollection: object;
  list_fieldsCollection: object;
}): MockLink.MockedResponse => ({
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
        edges: [boardEdge],
      },
      ...data,
    },
  },
});

export const emptyBoardMock = makeSingleBoardMock({
  list_fieldsCollection: emptyListFieldsCollection,
  cardsCollection: emptyCardsCollection,
});

export const boardWithFieldsNoCardsMock = makeSingleBoardMock({
  list_fieldsCollection: createdTextListFieldsCollection,
  cardsCollection: emptyCardsCollection,
});

export const CREATE_LIST_FIELDS_SUCCESS: {
  data: CachedListFieldsQuery;
  error: null;
} = {
  error: null,
  data: {
    __typename: 'Query',
    list_fieldsCollection: createdTextListFieldsCollection,
  },
};

const createdCardEdge = {
  __typename: 'cardsEdge',
  node: {
    __typename: 'cards',
    id: createdCardId,
    title: 'Career roadmap',
    position: 0,
    color: ColorPalette.third,
    listsCollection: {
      __typename: 'listsConnection',
      edges: [],
    },
  },
} satisfies NonNullable<CachedCardQuery['cardsCollection']>['edges'][number];

export const CREATE_CARD_SUCCESS: {
  data: CachedCardQuery;
  error: null;
} = {
  error: null,
  data: {
    __typename: 'Query',
    cardsCollection: {
      __typename: 'cardsConnection',
      edges: [createdCardEdge],
    },
  },
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
        id: 'created-text-value',
        value: 'Practice cache updates',
        list_fields: {
          __typename: 'list_fields',
          id: createdTextFieldId,
          type: Field_Type.Text,
          config: { title: 'Note' },
          position: 0,
        },
      },
    },
  ],
};

const createdListNode = makeFragmentData(
  {
    __typename: 'lists',
    id: createdListId,
    position: 0,
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
