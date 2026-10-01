'use client';

import {
  DragDropProvider,
  KeyboardSensor,
  PointerSensor,
} from '@dnd-kit/react';
import { useRef, useState, type ReactNode } from 'react';
import type { BoardLayout } from '@/utils/dragdrop/types';
import useBoardDragHandlers from '@/hooks/board/useBoardDragHandlers';
import useBoardLayoutSync from '@/hooks/board/useBoardLayoutSync';
import { useBoardContext } from './BoardContext';

// Drag sensor configuration
const dragSensors = [
  PointerSensor.configure({
    activatorElements(source) {
      return [source.handle];
    },
  }),
  KeyboardSensor,
];

type BoardDragDropAreaProps = {
  serverLayout: BoardLayout;
  children: (layout: BoardLayout, isDragging: boolean) => ReactNode;
};

function BoardDragDropArea({ serverLayout, children }: BoardDragDropAreaProps) {
  const { boardId } = useBoardContext();
  // The local layout is shared by drag interactions and save recovery.
  const [layout, setLayout] = useState(serverLayout);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);

  const { clearSaveTimer, requestLayoutSave, schedulePendingSave } =
    useBoardLayoutSync({
      boardId,
      serverLayout,
      setLayout,
      isDragging,
      isDraggingRef,
    });

  const { handleDragStart, handleDragOver, handleDragEnd } =
    useBoardDragHandlers({
      layout,
      setLayout,
      setIsDragging,
      isDraggingRef,
      onDragStarted: clearSaveTimer,
      onLayoutChanged: requestLayoutSave,
      onDragFinished: schedulePendingSave,
    });

  return (
    <DragDropProvider
      sensors={dragSensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children(layout, isDragging)}
    </DragDropProvider>
  );
}

export default BoardDragDropArea;
