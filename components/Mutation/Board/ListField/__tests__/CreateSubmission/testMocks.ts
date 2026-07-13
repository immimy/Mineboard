import { mockBoardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { CachedListFieldsQuery, Field_Type } from '@/gql/__generated__/graphql';

export const createdTextFieldId = 'created-text-field';

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

export const createdTextListFieldsCollection: NonNullable<
  CachedListFieldsQuery['list_fieldsCollection']
> = {
  __typename: 'list_fieldsConnection',
  edges: [createdTextFieldEdge],
};

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

export const CREATE_LIST_FIELDS_FAIL = {
  data: null,
  error: 'Failed to create list fields',
};

export const cachedListFieldsVariables = { boardId: mockBoardId };
