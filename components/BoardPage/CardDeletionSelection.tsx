'use client';

import type { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { CheckmarkIcon } from '@/icons/icons';
import { useCardDeletionsContext } from './CardDeletionsContext';

type CardDeletionSelectionProps = PropsWithChildren<{
  cardId: string;
}>;

function CardDeletionSelection({
  children,
  cardId,
}: CardDeletionSelectionProps) {
  const { isDeleteMode, deletedCards, updateDeletedCards } =
    useCardDeletionsContext();
  const isSelected = deletedCards.has(cardId);

  return (
    <div
      onClickCapture={(event) => {
        if (!isDeleteMode) return;

        updateDeletedCards(cardId);
        event.stopPropagation();
      }}
      className={clsx(
        isDeleteMode &&
          'relative before:absolute before:inset-0 before:bg-muted/55 before:z-1 before:border-t-4 before:border-muted-foreground/30 before:rounded-xl',
      )}
    >
      {/* CHECKED ICON: Is selected to the deletion? */}
      {isDeleteMode && (
        <span className='absolute top-3 right-3 grid place-items-center z-10 rounded-full p-2 bg-input/70 border border-border drop-shadow-sm dark:drop-shadow-border'>
          <CheckmarkIcon
            className={clsx(
              'stroke-successful/80 size-5',
              isSelected ? 'opacity-100' : 'opacity-0',
            )}
          />
        </span>
      )}
      {children}
    </div>
  );
}

export default CardDeletionSelection;
