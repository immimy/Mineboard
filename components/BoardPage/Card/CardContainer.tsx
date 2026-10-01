'use client';

import type { ColorPalette } from '@/types/jsonbSchema';
import type { ListQuery } from '@/utils/dragdrop/types';
import { memo } from 'react';
import CardDeletionSelection from './CardDeletionSelection';
import Card, { type CardProps } from './Card';
import CollapsibleCard, {
  type CardMeasurementCallback,
} from './CollapsibleCard';
import SortableCard from './SortableCard';

type CardContainerProps = {
  cardId: string;
  index: number;
  query: CardProps['query'];
  listQueries: ListQuery[];
  title: string;
  color: ColorPalette;
  isReadonly: boolean;
  isSingleColumn: boolean;
  onMeasurementChange: CardMeasurementCallback;
  isListDragOver: boolean;
};

function CardContainer({
  cardId,
  index,
  query,
  listQueries,
  title,
  color,
  isReadonly,
  isSingleColumn,
  onMeasurementChange,
  isListDragOver,
}: CardContainerProps) {
  return (
    <SortableCard id={cardId} index={index} isReadonly={isReadonly}>
      <CardDeletionSelection cardId={cardId}>
        <CollapsibleCard
          title={title}
          color={color}
          isSingleColumn={isSingleColumn}
          onMeasurementChange={onMeasurementChange}
          isListDragOver={isListDragOver}
        >
          {({ ref, contentId, isContentInert }) => (
            <Card
              ref={ref}
              contentId={contentId}
              query={query}
              listQueries={listQueries}
              isReadonly={isReadonly}
              isContentInert={isContentInert}
            />
          )}
        </CollapsibleCard>
      </CardDeletionSelection>
    </SortableCard>
  );
}

function areCardPropsEqual(
  previous: CardContainerProps,
  next: CardContainerProps,
) {
  const { listQueries: previousLists, ...previousProps } = previous;
  const { listQueries: nextLists, ...nextProps } = next;
  const keys = Object.keys(previousProps) as Array<keyof typeof previousProps>;

  // Compare query references as well as order, so content edits still render.
  return (
    keys.every((key) => Object.is(previousProps[key], nextProps[key])) &&
    previousLists.length === nextLists.length &&
    previousLists.every((query, index) => query === nextLists[index])
  );
}

export default memo(CardContainer, areCardPropsEqual);
