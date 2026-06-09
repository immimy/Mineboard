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

export const ListWithValuesQuery = graphql(/* GraphQL */ `
  query ListWithValues($listId: UUID!) {
    listsCollection(filter: { id: { eq: $listId } }) {
      edges {
        node {
          ...CreatedList
        }
      }
    }
  }
`);

export const CreatedListFragment = graphql(/* GraphQL */ `
  fragment CreatedList on lists {
    id
    position
    list_valuesCollection {
      ...ListValuesCollection @unmask
    }
  }
`);

export const CardQuery = graphql(/* GraphQL */ `
  query Card($cardId: UUID!) {
    cardsCollection(filter: { id: { eq: $cardId } }) {
      edges {
        node {
          ...CreatedCard
        }
      }
    }
  }
`);

export const CreatedCardFragment = graphql(/* GraphQL */ `
  fragment CreatedCard on cards {
    id
    title
    position
    color
    listsCollection(orderBy: [{ position: AscNullsLast }]) {
      ...ListsCollection @unmask
    }
  }
`);
