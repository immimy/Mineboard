'use client';

import {
  FragmentType,
  graphql,
  useFragment as readFragment,
} from '@/gql/__generated__';
import { createBoardData } from '@/utils/dragdrop/helper';
import { useMemo } from 'react';
import BoardDragDropArea from './BoardDragDropArea';
import CardContainer from './CardContainer';
import Card from './Card';

const CardsCollectionFragment = graphql(/* GraphQL */ `
  fragment CardsCollection on cardsConnection {
    edges {
      node {
        id
      }
      ...Card
    }
  }
`);

type CardsContainerProps = {
  query?: FragmentType<typeof CardsCollectionFragment> | null;
  isReadonly?: boolean;
};

function CardsContainer({ query, isReadonly = false }: CardsContainerProps) {
  const cards = readFragment(CardsCollectionFragment, query);
  // Converts server data into the DnD-friendly shape
  const serverData = useMemo(() => createBoardData(cards), [cards]);

  return (
    <BoardDragDropArea serverLayout={serverData.layout}>
      {(layout) => (
        <section className='mt-3 grid grid-cols-1 items-start gap-3 md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))]'>
          {layout.cardIds.map((cardId, index) => {
            const cardQuery = serverData.cardQueries.get(cardId);
            if (!cardQuery) return null;

            const listQueries = (layout.listIdsByCard[cardId] ?? []).flatMap(
              (listId) => {
                const listQuery = serverData.listQueries.get(listId);
                return listQuery ? [listQuery] : [];
              },
            );

            return (
              <CardContainer
                key={cardId}
                cardId={cardId}
                index={index}
                isReadonly={isReadonly}
              >
                <Card
                  query={cardQuery}
                  listQueries={listQueries}
                  isReadonly={isReadonly}
                />
              </CardContainer>
            );
          })}
        </section>
      )}
    </BoardDragDropArea>
  );
}
export default CardsContainer;
