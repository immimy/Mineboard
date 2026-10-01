import { move } from '@dnd-kit/helpers';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import {
  useRef,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react';
import type { BoardLayout } from '@/utils/dragdrop/types';

type UseBoardDragHandlersOptions = {
  layout: BoardLayout;
  setLayout: Dispatch<SetStateAction<BoardLayout>>;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  isDraggingRef: RefObject<boolean>;
  onDragStarted: () => void;
  onLayoutChanged: (layout: BoardLayout) => void;
  onDragFinished: () => void;
};

export default function useBoardDragHandlers({
  layout,
  setLayout,
  setIsDragging,
  isDraggingRef,
  onDragStarted,
  onLayoutChanged,
  onDragFinished,
}: UseBoardDragHandlersOptions) {
  const dragStartLayoutRef = useRef<BoardLayout | null>(null);

  const updateDraggingStatus = (nextIsDragging: boolean) => {
    isDraggingRef.current = nextIsDragging;
    setIsDragging(nextIsDragging);
  };

  // START:
  // - Save a snapshot before either a card or list drag starts.
  const handleDragStart = ({ operation }: DragStartEvent) => {
    const source = operation.source;
    if (
      !isSortable(source) ||
      (source.type !== 'card' && source.type !== 'list')
    ) {
      return;
    }

    updateDraggingStatus(true);
    onDragStarted();
    dragStartLayoutRef.current = layout;
  };

  // DRAGGING:
  // - Preventing list to be placed outside a card
  // - Enable list to be placed inside an empty card
  const handleDragOver = (event: DragOverEvent) => {
    const source = event.operation.source;
    if (!isSortable(source) || source.type !== 'list') return;

    setLayout((currentLayout) => {
      const nextListIdsByCard = move(currentLayout.listIdsByCard, event);
      if (nextListIdsByCard === currentLayout.listIdsByCard) {
        return currentLayout;
      }

      return {
        ...currentLayout,
        listIdsByCard: nextListIdsByCard,
      };
    });
  };

  // END:
  // Since moving list updates the layout while in the drag-over phase, so the
  // logic differs from moving card which updates the layout once in this drag-end.
  const handleDragEnd = (event: DragEndEvent) => {
    try {
      const { canceled, operation } = event;
      const source = operation.source;
      if (!isSortable(source)) return;

      const dragStartLayout = dragStartLayoutRef.current;
      dragStartLayoutRef.current = null;

      // Case I: Handle cards
      if (source.type === 'card') {
        if (canceled || operation.target?.type !== 'card') {
          // Rollback to the initial layout if canceled or invalid drop target
          if (dragStartLayout) setLayout(dragStartLayout);
          return;
        }

        const nextCardIds = move(layout.cardIds, event);
        if (nextCardIds === layout.cardIds) return;

        const nextLayout = { ...layout, cardIds: nextCardIds };
        setLayout(nextLayout);
        onLayoutChanged(nextLayout);
        return;
      }

      // Case II: Handle lists
      if (source.type === 'list') {
        if (
          canceled ||
          (operation.target?.type !== 'card' &&
            operation.target?.type !== 'list')
        ) {
          // Rollback to the initial layout if canceled or invalid drop target
          if (dragStartLayout) setLayout(dragStartLayout);
          return;
        }

        // Drag-over may have already applied the final list position,
        // so this move method may return the same layout.
        const nextListIdsByCard = move(layout.listIdsByCard, event);
        const nextLayout =
          nextListIdsByCard === layout.listIdsByCard
            ? layout
            : { ...layout, listIdsByCard: nextListIdsByCard };

        // No need to update layout again if there is no additional changes
        // on the list position after drag-over phase.
        if (nextLayout !== layout) setLayout(nextLayout);

        // Check against the drag-start snapshot when deciding whether to save.
        const hasMoved =
          dragStartLayout !== null &&
          nextLayout.listIdsByCard !== dragStartLayout.listIdsByCard;
        if (hasMoved) onLayoutChanged(nextLayout);
      }
    } finally {
      updateDraggingStatus(false);
      onDragFinished();
    }
  };

  return { handleDragStart, handleDragOver, handleDragEnd };
}
