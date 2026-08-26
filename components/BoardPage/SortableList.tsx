'use client';

import { useSortable } from '@dnd-kit/react/sortable';
import type { ListQuery } from '@/utils/dragdrop/types';
import { useCardContext } from './CardContext';
import { useCardDeletionsContext } from './CardDeletionsContext';
import List from './List';

type SortableListProps = {
  id: string;
  index: number;
  query: ListQuery;
};

function SortableList({ id, index, query }: SortableListProps) {
  const { cardId } = useCardContext();
  const { isDeleteMode } = useCardDeletionsContext();
  const { ref, handleRef, isDragging, isDropTarget } = useSortable({
    id,
    index,
    group: cardId,
    type: 'list',
    accept: 'list',
    disabled: isDeleteMode,
  });

  return (
    <List
      query={query}
      dragControls={{ ref, handleRef, isDragging, isDropTarget, index }}
    />
  );
}

export default SortableList;
