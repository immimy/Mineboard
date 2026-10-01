'use client';

import { useSortable } from '@dnd-kit/react/sortable';
import type { ListQuery } from '@/utils/dragdrop/types';
import { useCardContext } from '../Card/CardContext';
import { useCardDeletionMode } from '../Card/CardDeletionsContext';
import List from './List';
import { memo } from 'react';

type SortableListProps = {
  id: string;
  index: number;
  query: ListQuery;
  isInert?: boolean;
};

function SortableList({
  id,
  index,
  query,
  isInert = false,
}: SortableListProps) {
  const { cardId } = useCardContext();
  const isDeleteMode = useCardDeletionMode();
  const { ref, handleRef, isDragging, isDropTarget } = useSortable({
    id,
    index,
    group: cardId,
    type: 'list',
    accept: 'list',
    disabled: {
      // Keep hidden lists registered as drag sources so a cross-card move can
      // finish, but exclude their clipped boxes from collision detection.
      draggable: isDeleteMode,
      droppable: isDeleteMode || isInert,
    },
  });

  return (
    <List
      query={query}
      dragControls={{ ref, handleRef, isDragging, isDropTarget, index }}
    />
  );
}

export default memo(SortableList);
