'use client';

import { useRef, useState } from 'react';
import { useDragDropMonitor } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';

type UseCardDragExpansionOptions = {
  isReadonly: boolean;
  isSingleColumn: boolean;
};

export default function useCardDragExpansion({
  isReadonly,
  isSingleColumn,
}: UseCardDragExpansionOptions) {
  // Stores the original card of the list at the beginning of drag operation
  const listDragOriginCardIdRef = useRef<string | undefined>(undefined);
  const [listDragOverCardId, setListDragOverCardId] = useState<
    string | undefined
  >();

  useDragDropMonitor({
    onDragStart({ operation }) {
      const source = operation.source;
      if (source?.type !== 'list' || !isSortable(source)) return;

      // Cross-card moves remount the list and can reset dnd-kit's initialGroup.
      // Keep our own origin for the entire drag instead.
      listDragOriginCardIdRef.current =
        source.group === undefined ? undefined : String(source.group);
    },
    onDragOver({ operation }) {
      const { source, target } = operation;
      if (source?.type !== 'list' || !isSortable(source)) return;

      const targetCardId =
        target?.type === 'card'
          ? target.id
          : target?.type === 'list' && isSortable(target)
            ? target.group
            : undefined;

      // Different list targets in the same card keep the same state value.
      // Leaving an eligible target clears the pending expansion timer.
      setListDragOverCardId(
        !isReadonly &&
          !isSingleColumn &&
          targetCardId !== undefined &&
          String(targetCardId) !== listDragOriginCardIdRef.current
          ? String(targetCardId)
          : undefined,
      );
    },
    onDragEnd() {
      // Clear original card reference and hover tracking
      listDragOriginCardIdRef.current = undefined;
      setListDragOverCardId(undefined);
    },
  });

  return listDragOverCardId;
}
