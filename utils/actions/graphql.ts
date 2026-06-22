import { graphql } from '@/gql/__generated__';
import { getClient } from '@/gql/apollo/ApolloClient';
import { OperationVariables } from '@apollo/client';
import { ApolloClient } from '@apollo/client';

export const customQuery = async <
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  options: ApolloClient.QueryOptions<TData, TVariables>,
) => {
  const { query } = getClient();
  const { data, error } = await query(options);
  if (error) throw new Error(error.message);
  return data;
};

/** List */

export const BoardListFieldsQuery = graphql(/* GraphQL */ `
  query BoardListFields($boardId: UUID!) {
    list_fieldsCollection(filter: { board_id: { eq: $boardId } }) {
      edges {
        node {
          id
          type
        }
      }
    }
  }
`);

export const CachedListQuery = graphql(/* GraphQL */ `
  query CachedList($listId: UUID!) {
    listsCollection(filter: { id: { eq: $listId } }) {
      edges {
        node {
          ...MutatedList
        }
      }
    }
  }
`);

export const MutatedListFragment = graphql(/* GraphQL */ `
  fragment MutatedList on lists {
    id
    position
    list_valuesCollection {
      ...ListValuesCollection @unmask
    }
  }
`);

/** Card */

export const CachedCardQuery = graphql(/* GraphQL */ `
  query CachedCard($cardId: UUID!) {
    cardsCollection(filter: { id: { eq: $cardId } }) {
      edges {
        ...Card @unmask
      }
    }
  }
`);

/** Board */

export const CachedBoardQuery = graphql(/* GraphQL */ `
  query CachedBoard($boardId: UUID!) {
    boardsCollection(filter: { id: { eq: $boardId } }) {
      edges {
        ...Board @unmask
      }
    }
  }
`);

export const CachedListFieldsQuery = graphql(/* GraphQL */ `
  query CachedListFields($boardId: UUID!) {
    list_fieldsCollection(
      filter: { board_id: { eq: $boardId } }
      orderBy: [{ position: AscNullsLast }]
    ) {
      ...ListFieldsCollection @unmask
    }
  }
`);
