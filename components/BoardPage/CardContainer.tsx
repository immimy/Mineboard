'use client';

import type { PropsWithChildren } from 'react';
import CardDeletionSelection from './CardDeletionSelection';
import SortableCard from './SortableCard';

type CardContainerProps = PropsWithChildren<{
  cardId: string;
  index: number;
  isReadonly: boolean;
}>;

function CardContainer({
  children,
  cardId,
  index,
  isReadonly,
}: CardContainerProps) {
  return (
    <SortableCard id={cardId} index={index} isReadonly={isReadonly}>
      <CardDeletionSelection cardId={cardId}>{children}</CardDeletionSelection>
    </SortableCard>
  );
}

export default CardContainer;
