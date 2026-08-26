'use client';

import { move } from '@dnd-kit/helpers';
import {
  DragDropProvider,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
} from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import { saveBoardLayout } from '@/utils/actions/board';
import type { BoardLayout, BoardLayoutSaveJob } from '@/utils/dragdrop/types';
import { useBoardContext } from './BoardContext';
import { renderError } from '../global/utils';

// Drag sensor configuration
const dragSensors = [
  PointerSensor.configure({
    activatorElements(source) {
      return [source.handle];
    },
  }),
  KeyboardSensor,
];

const SAVE_DEBOUNCE_MS = 1000;

type BoardDragDropAreaProps = {
  serverLayout: BoardLayout;
  children: (layout: BoardLayout) => ReactNode;
};

function BoardDragDropArea({ serverLayout, children }: BoardDragDropAreaProps) {
  const { boardId } = useBoardContext();

  // The local layout is the rendering source of truth.
  // Server updates are copied into it only after the active drag has finished.
  const [layout, setLayout] = useState(serverLayout);
  const [isDragging, setIsDragging] = useState(false);
  const [failedSaveVersion, setFailedSaveVersion] = useState<number | null>(
    null,
  );

  const isDraggingRef = useRef(false);
  const dragStartLayoutRef = useRef<BoardLayout | null>(null);
  // latest successful save layout request
  const lastSavedLayoutRef = useRef(serverLayout);
  // latest server layout applied to rendering layout
  const appliedServerLayoutRef = useRef(serverLayout);

  const debouncedSaveRef = useRef<BoardLayoutSaveJob | null>(null);
  const pendingSaveRef = useRef<BoardLayoutSaveJob | null>(null);
  const isWorkerRunningRef = useRef(false);
  const saveVersionRef = useRef(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateDraggingStatus = (nextIsDragging: boolean) => {
    isDraggingRef.current = nextIsDragging;
    setIsDragging(nextIsDragging);
  };

  // Accept the latest server snapshot once it can no longer interrupt a drag.
  // Tracking the last applied object prevents drag end from restoring an
  // unchanged, potentially stale server snapshot over the optimistic layout.
  useEffect(() => {
    if (isDragging || appliedServerLayoutRef.current === serverLayout) return;

    appliedServerLayoutRef.current = serverLayout;
    lastSavedLayoutRef.current = serverLayout;
    setLayout(serverLayout);
  }, [isDragging, serverLayout]);

  // A failed latest save is restored only after the active drag has finished.
  // Running this from an effect avoids changing the layout inside dnd-kit's
  // drag-end callback while it is still finalizing its sortable state.
  useEffect(() => {
    if (isDragging || failedSaveVersion === null) return;

    if (failedSaveVersion !== saveVersionRef.current) {
      setFailedSaveVersion(null);
      return;
    }

    setLayout(lastSavedLayoutRef.current);
    setFailedSaveVersion(null);
    toast.error(
      'Failed to save the latest board layout. The last saved order was restored.',
    );
  }, [failedSaveVersion, isDragging]);

  // Clean up timer when component is unmounted.
  useEffect(
    () => () => {
      if (saveTimerRef.current !== null) {
        clearTimeout(saveTimerRef.current);
      }
    },
    [],
  );

  // Runs one save request at a time. A complete newer layout may replace the
  // waiting job while the active request finishes.
  const startWorker = async () => {
    if (isWorkerRunningRef.current) return;

    isWorkerRunningRef.current = true;

    try {
      while (pendingSaveRef.current) {
        const job = pendingSaveRef.current;
        pendingSaveRef.current = null;

        try {
          const { error } = await saveBoardLayout(boardId, job.layout);
          if (error) throw new Error(error);

          lastSavedLayoutRef.current = job.layout;
          setFailedSaveVersion(null);
        } catch (error) {
          renderError(error);
          // Set failed version for rollback
          if (job.version === saveVersionRef.current) {
            setFailedSaveVersion(job.version);
          }
        }
      }
    } finally {
      isWorkerRunningRef.current = false;
    }
  };

  const clearSaveTimer = () => {
    if (saveTimerRef.current === null) return;

    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = null;
  };

  const schedulePendingSave = () => {
    clearSaveTimer();
    if (isDraggingRef.current || !debouncedSaveRef.current) return;

    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null;
      if (isDraggingRef.current || !debouncedSaveRef.current) return;

      pendingSaveRef.current = debouncedSaveRef.current;
      debouncedSaveRef.current = null;
      void startWorker();
    }, SAVE_DEBOUNCE_MS);
  };

  const requestLayoutSave = (nextLayout: BoardLayout) => {
    const job = {
      version: saveVersionRef.current + 1,
      layout: nextLayout,
    };

    saveVersionRef.current = job.version;
    debouncedSaveRef.current = job;
    setFailedSaveVersion(null);
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
    clearSaveTimer();
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
        requestLayoutSave(nextLayout);
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
        if (hasMoved) requestLayoutSave(nextLayout);
      }
    } finally {
      updateDraggingStatus(false);
      schedulePendingSave();
    }
  };

  return (
    <DragDropProvider
      sensors={dragSensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children(layout)}
    </DragDropProvider>
  );
}

export default BoardDragDropArea;
