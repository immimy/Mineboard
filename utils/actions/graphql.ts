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
  const { data, error } = await query({ fetchPolicy: 'no-cache', ...options });
  if (error) throw new Error(error.message);
  return data;
};

export const customMutation = async <
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  options: ApolloClient.MutateOptions<TData, TVariables>,
) => {
  const { mutate } = getClient();
  const { data, error } = await mutate(options);
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

export const ListValuesQuery = graphql(/* GraphQL */ `
  query ListValues($listId: UUID!) {
    list_valuesCollection(filter: { list_id: { eq: $listId } }) {
      edges {
        node {
          id
          list_field_id
          value
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

export const CachedBoardListsQuery = graphql(/* GraphQL */ `
  query CachedBoardLists($boardId: UUID!) {
    cardsCollection(
      filter: { board_id: { eq: $boardId } }
      orderBy: [{ position: AscNullsLast }]
    ) {
      edges {
        node {
          id
          listsCollection(orderBy: [{ position: AscNullsLast }]) {
            edges {
              node {
                id
              }
              ...List @unmask
            }
          }
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
      edges {
        node {
          ...ListValues @unmask
        }
      }
    }
  }
`);

export const DeleteListMutation = graphql(/* GraphQL */ `
  mutation DeleteList($cardId: UUID!, $listId: UUID!) {
    deleteFromlistsCollection(
      filter: { card_id: { eq: $cardId }, id: { eq: $listId } }
      atMost: 1
    ) {
      affectedCount
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

export const UpdateCardMutation = graphql(/* GraphQL */ `
  mutation UpdateCard(
    $cardId: UUID!
    $title: String!
    $color: Opaque!
    $updatedAt: Datetime!
  ) {
    updatecardsCollection(
      filter: { id: { eq: $cardId } }
      set: { title: $title, color: $color, updated_at: $updatedAt }
      atMost: 1
    ) {
      records {
        id
        title
        color
      }
    }
  }
`);

export const DeleteCardsMutation = graphql(/* GraphQL */ `
  mutation DeleteCards(
    $boardId: UUID!
    $cardIds: [UUID!]!
    $expectedCount: Int!
  ) {
    deleteFromcardsCollection(
      filter: { board_id: { eq: $boardId }, id: { in: $cardIds } }
      atMost: $expectedCount
    ) {
      affectedCount
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

export const UpdateBoardTitleMutation = graphql(/* GraphQL */ `
  mutation UpdateBoardTitle(
    $boardId: UUID!
    $title: String!
    $updatedAt: Datetime!
  ) {
    updateboardsCollection(
      filter: { id: { eq: $boardId } }
      set: { title: $title, updated_at: $updatedAt }
      atMost: 1
    ) {
      records {
        id
        title
      }
    }
  }
`);

export const DeleteBoardMutation = graphql(/* GraphQL */ `
  mutation DeleteBoard($boardId: UUID!, $userId: UUID!) {
    deleteFromboardsCollection(
      filter: { id: { eq: $boardId }, user_id: { eq: $userId } }
      atMost: 1
    ) {
      affectedCount
    }
  }
`);

/** List Field */

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
