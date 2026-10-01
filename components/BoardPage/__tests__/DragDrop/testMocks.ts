import { makeFragmentData, type FragmentType } from '@/gql/__generated__';
import {
  CardFragmentDoc,
  CardsCollectionFragmentDoc,
  Field_Type,
  ListFragmentDoc,
  ListValuesFragmentDoc,
  type CardFragment,
  type CardsCollectionFragment,
  type ListFragment,
  type ListValuesFragment,
} from '@/gql/__generated__/graphql';
import type { BoardLayout, CardQuery, ListQuery } from '@/utils/dragdrop/types';
import { createElement, useId, type ComponentProps } from 'react';
import type CollapsibleCard from '@/components/BoardPage/Card/CollapsibleCard';

// Mocks `CollapsibleCard` to be always expanded.
// These tests exercise sorting and saving with every list visible.
export function ExpandedCardMock({
  children,
}: ComponentProps<typeof CollapsibleCard>) {
  const contentId = useId();

  return createElement(
    'div',
    { className: 'relative min-h-(--card-min-height)' },
    children({ ref: null, contentId, isContentInert: false }),
  );
}

type TestCard = {
  id: string;
  title: string;
  lists: Array<{ id: string; label: string }>;
};

const testCards: TestCard[] = [
  {
    id: 'card-a',
    title: 'Card A',
    lists: [
      { id: 'list-1', label: 'List one' },
      { id: 'list-2', label: 'List two' },
    ],
  },
  { id: 'card-b', title: 'Card B', lists: [] },
  {
    id: 'card-c',
    title: 'Card C',
    lists: [{ id: 'list-3', label: 'List three' }],
  },
];

export const serverLayout: BoardLayout = {
  cardIds: ['card-a', 'card-b', 'card-c'],
  listIdsByCard: {
    'card-a': ['list-1', 'list-2'],
    'card-b': [],
    'card-c': ['list-3'],
  },
};

const createListQuery = (
  id: string,
  cardId: string,
  position: number,
  label: string,
): ListQuery => {
  const value = {
    __typename: 'list_values',
    id: `value-${id}`,
    value: label,
    list_fields: {
      __typename: 'list_fields',
      id: 'field-text',
      type: Field_Type.Text,
      config: { title: 'Label' },
      position: 0,
    },
  } satisfies ListValuesFragment;

  const list = {
    __typename: 'listsEdge',
    node: {
      __typename: 'lists',
      id,
      card_id: cardId,
      position,
      list_valuesCollection: {
        __typename: 'list_valuesConnection',
        edges: [
          {
            __typename: 'list_valuesEdge',
            node: {
              __typename: 'list_values',
              ...makeFragmentData(value, ListValuesFragmentDoc),
            },
          },
        ],
      },
    },
  } satisfies ListFragment;

  return {
    __typename: 'listsEdge',
    node: { __typename: 'lists', id },
    ...makeFragmentData(list, ListFragmentDoc),
  };
};

const createCardQuery = (
  { id, title, lists }: TestCard,
  position: number,
): CardQuery => {
  const listQueries = lists.map(({ id: listId, label }, listPosition) =>
    createListQuery(listId, id, listPosition, label),
  );

  const card = {
    __typename: 'cardsEdge',
    node: {
      __typename: 'cards',
      id,
      title,
      position,
      color: position + 1,
      listsCollection: {
        __typename: 'listsConnection',
        edges: listQueries,
      },
    },
  } satisfies CardFragment;

  return {
    __typename: 'cardsEdge',
    node: { __typename: 'cards', id },
    ...makeFragmentData(card, CardFragmentDoc),
  };
};

export const createCardsQuery = (): FragmentType<
  typeof CardsCollectionFragmentDoc
> =>
  makeFragmentData(
    {
      __typename: 'cardsConnection',
      edges: testCards.map(createCardQuery),
    } satisfies CardsCollectionFragment,
    CardsCollectionFragmentDoc,
  );

export const createDeferred = <T>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
};
