'use client';

import { useFragment as readFragment } from '@/gql/__generated__';
import { ColorPalette } from '@/types/jsonbSchema';
import type { BoardData, BoardLayout } from '@/utils/dragdrop/types';
import CardContainer from './CardContainer';
import clsx from 'clsx';
import { CardFragmentDoc } from '@/gql/__generated__/graphql';
import useCardMeasurements from '@/hooks/board/useCardMeasurements';
import useCardDragExpansion from '@/hooks/board/useCardDragExpansion';

// Define constant to control minimum height of card
const CARD_HEIGHT_CONSTRAINT = {
  minHeight: 350, // px
  minHeightCss: '[--card-min-height:350px]',
};

const EMPTY_LIST_IDS: string[] = [];

type CardsGridProps = {
  layout: BoardLayout;
  serverData: BoardData;
  isDragging: boolean;
  isReadonly: boolean;
};

function CardsGrid({
  layout,
  serverData,
  isDragging,
  isReadonly,
}: CardsGridProps) {
  const { cardsGridRef, isSingleColumn, registerCardMeasurement } =
    useCardMeasurements({
      isDragging,
      minHeight: CARD_HEIGHT_CONSTRAINT.minHeight,
    });
  const listDragOverCardId = useCardDragExpansion({
    isReadonly,
    isSingleColumn,
  });

  return (
    <section
      ref={cardsGridRef}
      className={clsx(
        'mt-3 grid grid-cols-1 items-start gap-3 md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))]',
        !isSingleColumn && CARD_HEIGHT_CONSTRAINT.minHeightCss,
      )}
    >
      {layout.cardIds.map((cardId, index) => {
        const cardQuery = serverData.cardQueries.get(cardId);
        if (!cardQuery) return null;
        const card = readFragment(CardFragmentDoc, cardQuery).node;
        const listQueries = (
          layout.listIdsByCard[cardId] ?? EMPTY_LIST_IDS
        ).flatMap((listId) => {
          const query = serverData.listQueries.get(listId);
          return query ? [query] : [];
        });

        return (
          <CardContainer
            key={cardId}
            cardId={cardId}
            index={index}
            query={cardQuery}
            listQueries={listQueries}
            title={card.title}
            color={card.color as ColorPalette}
            isReadonly={isReadonly}
            isSingleColumn={isSingleColumn}
            onMeasurementChange={registerCardMeasurement}
            isListDragOver={
              isDragging &&
              !isReadonly &&
              !isSingleColumn &&
              listDragOverCardId === cardId
            }
          />
        );
      })}
    </section>
  );
}

export default CardsGrid;
