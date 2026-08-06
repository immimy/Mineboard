import { graphql } from '@/gql/__generated__';
import {
  OrderByDirection,
  type AllBoardsQueryVariables,
  type BoardTitleQueryVariables,
  type QueryBoardsCollectionArgs,
  type QueryCardsCollectionArgs,
  type QueryList_FieldsCollectionArgs,
  type SingleBoardQueryVariables,
} from '@/gql/__generated__/graphql';

/** Single Board Query */

export const SingleBoardQuery = graphql(/* GraphQL */ `
  query SingleBoard(
    $boardsCollectionFilter: boardsFilter!
    $listFieldsCollectionFilter: list_fieldsFilter!
    $listFieldsCollectionOrderBy: [list_fieldsOrderBy!]!
    $cardsCollectionFilter: cardsFilter!
    $cardsCollectionOrderBy: [cardsOrderBy!]!
  ) {
    boardsCollection(filter: $boardsCollectionFilter) {
      edges {
        ...Board
      }
    }
    list_fieldsCollection(
      filter: $listFieldsCollectionFilter
      orderBy: $listFieldsCollectionOrderBy
    ) {
      ...ListFieldsCollection
    }
    cardsCollection(
      filter: $cardsCollectionFilter
      orderBy: $cardsCollectionOrderBy
    ) {
      ...CardsCollection
    }
  }
`);

export function getSingleBoardQueryConfig(boardId: string) {
  const boardsCollection = {
    args: {
      filter: { id: { eq: boardId } },
    } satisfies QueryBoardsCollectionArgs,
  };
  const listFieldsCollection = {
    args: {
      filter: { board_id: { eq: boardId } },
      orderBy: [{ position: OrderByDirection.AscNullsLast }],
    } satisfies QueryList_FieldsCollectionArgs,
  };
  const cardsCollection = {
    args: {
      filter: { board_id: { eq: boardId } },
      orderBy: [{ position: OrderByDirection.AscNullsLast }],
    } satisfies QueryCardsCollectionArgs,
  };

  const variables = {
    boardsCollectionFilter: boardsCollection.args.filter,
    listFieldsCollectionFilter: listFieldsCollection.args.filter,
    listFieldsCollectionOrderBy: listFieldsCollection.args.orderBy,
    cardsCollectionFilter: cardsCollection.args.filter,
    cardsCollectionOrderBy: cardsCollection.args.orderBy,
  } satisfies SingleBoardQueryVariables;

  return {
    variables,
    boardsCollection,
    listFieldsCollection,
    cardsCollection,
  };
}

/** All Boards Query */

export const AllBoardsQuery = graphql(/* GraphQL */ `
  query AllBoards(
    $boardsCollectionFilter: boardsFilter!
    $boardsCollectionOrderBy: [boardsOrderBy!]!
  ) {
    boardsCollection(
      filter: $boardsCollectionFilter
      orderBy: $boardsCollectionOrderBy
    ) {
      edges {
        node {
          id
        }
        ...Board
      }
    }
  }
`);

export function getAllBoardsQueryConfig(userId: string) {
  const boardsCollection = {
    args: {
      filter: { user_id: { eq: userId } },
      orderBy: [{ created_at: OrderByDirection.DescNullsLast }],
    } satisfies QueryBoardsCollectionArgs,
  };

  const variables = {
    boardsCollectionFilter: boardsCollection.args.filter,
    boardsCollectionOrderBy: boardsCollection.args.orderBy,
  } satisfies AllBoardsQueryVariables;

  return { variables, boardsCollection };
}

/** Board Title Query */

export const BoardTitleQuery = graphql(/* GraphQL */ `
  query BoardTitle($boardsCollectionFilter: boardsFilter!) {
    boardsCollection(filter: $boardsCollectionFilter) {
      edges {
        ...Board @unmask
      }
    }
  }
`);

export function getBoardTitleQueryConfig(boardId: string) {
  const boardsCollection = {
    args: {
      filter: { id: { eq: boardId } },
    } satisfies QueryBoardsCollectionArgs,
  };

  const variables = {
    boardsCollectionFilter: boardsCollection.args.filter,
  } satisfies BoardTitleQueryVariables;

  return { variables, boardsCollection };
}
