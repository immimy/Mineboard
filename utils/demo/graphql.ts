import { graphql } from '@/gql/__generated__';
import {
  OrderByDirection,
  type BoardsCardsCollectionArgs,
  type BoardsList_FieldsCollectionArgs,
  type DemoHomepageQueryVariables,
  type QueryBoardsCollectionArgs,
} from '@/gql/__generated__/graphql';

export const DemoHomepageQuery = graphql(/* GraphQL */ `
  query DemoHomepage(
    $boardsCollectionFilter: boardsFilter!
    $boardsCollectionOrderBy: [boardsOrderBy!]!
    $listFieldsCollectionOrderBy: [list_fieldsOrderBy!]!
    $cardsCollectionOrderBy: [cardsOrderBy!]!
  ) {
    boardsCollection(
      filter: $boardsCollectionFilter
      orderBy: $boardsCollectionOrderBy
    ) {
      edges {
        ...Board @unmask
        node {
          list_fieldsCollection(orderBy: $listFieldsCollectionOrderBy) {
            ...ListFieldsCollection
          }
          cardsCollection(orderBy: $cardsCollectionOrderBy) {
            ...CardsCollection
          }
        }
      }
    }
  }
`);

export function getDemoHomepageQueryConfig(userId: string) {
  const boardsCollection = {
    args: {
      filter: { user_id: { eq: userId } },
      orderBy: [{ created_at: OrderByDirection.DescNullsLast }],
    } satisfies QueryBoardsCollectionArgs,
  };
  const listFieldsCollection = {
    args: {
      orderBy: [{ position: OrderByDirection.AscNullsLast }],
    } satisfies BoardsList_FieldsCollectionArgs,
  };
  const cardsCollection = {
    args: {
      orderBy: [{ position: OrderByDirection.AscNullsLast }],
    } satisfies BoardsCardsCollectionArgs,
  };

  const variables = {
    boardsCollectionFilter: boardsCollection.args.filter,
    boardsCollectionOrderBy: boardsCollection.args.orderBy,
    listFieldsCollectionOrderBy: listFieldsCollection.args.orderBy,
    cardsCollectionOrderBy: cardsCollection.args.orderBy,
  } satisfies DemoHomepageQueryVariables;

  return {
    variables,
    boardsCollection,
    listFieldsCollection,
    cardsCollection,
  };
}
