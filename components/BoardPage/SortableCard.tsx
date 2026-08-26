'use client';

import { useSortable } from '@dnd-kit/react/sortable';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useCardDeletionsContext } from './CardDeletionsContext';
import clsx from 'clsx';
import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';
import type { DragControls } from '@/types/app';

/** Context */
type CardSortContextValue = {
  dragHandleRef?: DragControls['handleRef'];
  isSortEnabled: boolean;
};

const CardSortContext = createContext<CardSortContextValue>({
  isSortEnabled: false,
});

export function useCardSortContext() {
  const state = useContext(CardSortContext);
  if (!state)
    throw new Error('useCardSortContext must be used in CardSortProvider');
  return state;
}
/** */

type SortableCardProps = PropsWithChildren<{
  id: string;
  index: number;
  isReadonly: boolean;
}>;

function SortableCard({ children, id, index, isReadonly }: SortableCardProps) {
  const { isDeleteMode } = useCardDeletionsContext();
  const { ref, handleRef, isDragging, isDropTarget } = useSortable({
    id,
    index,
    type: 'card',
    accept: ['card', 'list'],
    collisionPriority: CollisionPriority.Low,
    disabled: isReadonly || isDeleteMode,
  });
  const sortContextValue = useMemo(
    () => ({ dragHandleRef: handleRef, isSortEnabled: !isReadonly }),
    [handleRef, isReadonly],
  );

  return (
    <div
      ref={ref}
      className={clsx(
        'rounded-xl transition-[opacity,transform,box-shadow] duration-200',
        isDragging && 'scale-[0.98] opacity-40',
        isDropTarget &&
          'ring-2 ring-accent ring-offset-2 ring-offset-background',
      )}
    >
      <CardSortContext.Provider value={sortContextValue}>
        {children}
      </CardSortContext.Provider>
    </div>
  );
}
export default SortableCard;
