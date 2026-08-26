import type {
  CardFragment,
  CardsCollectionFragment,
} from '@/gql/__generated__/graphql';

export type CardQuery = CardsCollectionFragment['edges'][number];
export type ListQuery = NonNullable<
  CardFragment['node']['listsCollection']
>['edges'][number];

export type BoardLayout = {
  cardIds: string[]; // cardIds[]
  listIdsByCard: Record<string, string[]>; // { cardId: listIds[] }
};

export type BoardData = {
  layout: BoardLayout;
  cardQueries: Map<string, CardQuery>;
  listQueries: Map<string, ListQuery>;
};

export type BoardLayoutSaveJob = {
  version: number;
  layout: BoardLayout;
};
