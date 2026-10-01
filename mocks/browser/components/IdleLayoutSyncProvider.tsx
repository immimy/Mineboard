import { type PropsWithChildren, useEffect } from 'react';
import LayoutMutationSyncProvider, {
  useLayoutMutationSync,
} from '@/components/BoardPage/Board/LayoutMutationSyncProvider';

function IdleLayoutRegistration({ boardId }: { boardId: string }) {
  const { registerLayoutSave } = useLayoutMutationSync();

  useEffect(() => {
    return registerLayoutSave(
      boardId,
      {
        saveTimerRef: { current: null },
        queuedSaveRef: { current: null },
        pendingSaveRef: { current: null },
        isWorkerRunningRef: { current: false },
      },
      () => {},
    );
  }, [boardId, registerLayoutSave]);

  return null;
}

// Isolated dialog tests have no drag area to register the board's layout worker.
// Use the real mutation runner with a registered board that has no pending saves.
export default function IdleLayoutSyncProvider({
  boardId,
  children,
}: PropsWithChildren<{ boardId: string }>) {
  return (
    <LayoutMutationSyncProvider>
      <IdleLayoutRegistration boardId={boardId} />
      {children}
    </LayoutMutationSyncProvider>
  );
}
