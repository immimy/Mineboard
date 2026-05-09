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

export const BoardListFieldsDocumentQuery = graphql(/* GraphQL */ `
  query BoardListFieldsDocument($boardId: UUID!) {
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

export const ListWithValuesDocumentQuery = graphql(/* GraphQL */ `
  query ListWithValuesDocument($listId: UUID!) {
    listsCollection(filter: { id: { eq: $listId } }) {
      edges {
        node {
          ...createdList
        }
      }
    }
  }
`);

export const CreatedListFragment = graphql(/* GraphQL */ `
  fragment createdList on lists {
    id
    position
    list_valuesCollection {
      ...ListValuesCollection @unmask
    }
  }
`);
