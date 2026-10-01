import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react';
import { useApolloClient } from '@apollo/client/react';
import { toast } from 'react-toastify';
import { saveBoardLayout } from '@/utils/actions/board';
import type { BoardLayout, BoardLayoutSaveJob } from '@/utils/dragdrop/types';
import { updateBoardLayoutCache } from '@/utils/dragdrop/cache';
import { useLayoutMutationSync } from '@/components/BoardPage/Board/LayoutMutationSyncProvider';
import { BoardTitleQuery, getBoardTitleQueryConfig } from '@/gql/queries';

const SAVE_DEBOUNCE_MS = 1500;

type UseBoardLayoutSyncOptions = {
  boardId: string;
  serverLayout: BoardLayout;
  setLayout: Dispatch<SetStateAction<BoardLayout>>;
  isDragging: boolean;
  isDraggingRef: RefObject<boolean>;
};

export default function useBoardLayoutSync({
  boardId,
  serverLayout,
  setLayout,
  isDragging,
  isDraggingRef,
}: UseBoardLayoutSyncOptions) {
  const client = useApolloClient();
  const {
    registerLayoutSave,
    trackLayoutSave,
    completeLayoutSave,
    setLayoutRollbackStatus,
  } = useLayoutMutationSync();

  const [failedSaveVersion, setFailedSaveVersion] = useState<number | null>(
    null,
  );

  // latest successful save layout request
  const lastSavedLayoutRef = useRef(serverLayout);
  // latest server layout applied to rendering layout
  const appliedServerLayoutRef = useRef(serverLayout);

  const queuedSaveRef = useRef<BoardLayoutSaveJob | null>(null);
  const pendingSaveRef = useRef<BoardLayoutSaveJob | null>(null);
  const isWorkerRunningRef = useRef(false);
  const saveVersionRef = useRef(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** SERVER LAYOUT UPDATE EFFECT */
  // Accept the latest server snapshot once it can no longer interrupt a drag.
  // Use `appliedServerLayoutRef` as a safeguard, ensuring to apply each incoming snapshot once.
  useEffect(() => {
    if (
      isDragging ||
      isWorkerRunningRef.current ||
      queuedSaveRef.current ||
      pendingSaveRef.current ||
      appliedServerLayoutRef.current === serverLayout
    )
      return;

    appliedServerLayoutRef.current = serverLayout;
    lastSavedLayoutRef.current = serverLayout;
    setLayout(serverLayout);
  }, [isDragging, serverLayout, setLayout]);

  /** ROLLBACK EFFECT */
  // The latest failure is restored only after the active drag has finished.
  // Running this from an effect avoids changing the layout inside dnd-kit's
  // drag-end callback while it is still finalizing its sortable state.
  useEffect(() => {
    if (isDragging || failedSaveVersion === null) return;

    if (failedSaveVersion === saveVersionRef.current) {
      setLayout(lastSavedLayoutRef.current);
      toast.info('Restored layout to the last stable one.');
    }
    // Recovery must wait for dnd-kit to finish before clearing the failure.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFailedSaveVersion(null);
    setLayoutRollbackStatus(boardId, 'handled');
  }, [
    boardId,
    failedSaveVersion,
    isDragging,
    setLayout,
    setLayoutRollbackStatus,
  ]);

  /** ROLLBACK COMPLETION EFFECT */
  // Acknowledge the rollback completion after the cleared failure state commits,
  // whether the layout was restored or the failure was outdated.
  useEffect(() => {
    if (failedSaveVersion === null) {
      setLayoutRollbackStatus(boardId, 'committed');
    }
  }, [boardId, failedSaveVersion, setLayoutRollbackStatus]);

  /** START WORKER */
  // Runs one save request at a time. A complete newer layout may replace the
  // waiting job while the active request finishes.
  const startWorker = useCallback(async () => {
    if (isWorkerRunningRef.current || !pendingSaveRef.current) return;

    // Capture the board name while its data is still available. This worker can
    // finish after navigation, when a different board is on screen.
    const board = client.readQuery({
      query: BoardTitleQuery,
      variables: getBoardTitleQueryConfig(boardId).variables,
    });
    const boardTitle = board?.boardsCollection?.edges[0]?.node.title || boardId;

    isWorkerRunningRef.current = true;

    try {
      while (pendingSaveRef.current) {
        const job = pendingSaveRef.current;
        pendingSaveRef.current = null;

        try {
          const { error } = await saveBoardLayout(boardId, job.layout);
          if (error) throw new Error(error);

          lastSavedLayoutRef.current = job.layout;
          // Publish only confirmed ordering, preserving the current content.
          updateBoardLayoutCache(client.cache, job.layout);
        } catch {
          if (job.version === saveVersionRef.current) {
            toast.error(
              `Failed to save the latest "${boardTitle}" board layout.`,
            );
            setLayoutRollbackStatus(boardId, 'pending');
            setFailedSaveVersion(job.version);
          }
        }
      }
    } finally {
      isWorkerRunningRef.current = false;
      completeLayoutSave(boardId);
    }
  }, [boardId, client, completeLayoutSave, setLayoutRollbackStatus]);

  /** CLEAR TIMER */
  const clearSaveTimer = useCallback(() => {
    if (saveTimerRef.current === null) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = null;
  }, []);

  /** FLUSH QUEUED SAVE */
  // Both the debounce and a waiting mutation use the same queue flush.
  const flushQueuedSave = useCallback(() => {
    clearSaveTimer();
    if (isDraggingRef.current) return;

    if (queuedSaveRef.current) {
      pendingSaveRef.current = queuedSaveRef.current;
      queuedSaveRef.current = null;
    }
    void startWorker();
  }, [clearSaveTimer, isDraggingRef, startWorker]);

  /** MUTATION SYNC PROVIDER REGISTRATION EFFECT */
  // Dashboard entry has already awaited previous saves before mounting this component.
  // Register before interaction; cleanup flushes the last completed drag.
  useLayoutEffect(() => {
    const unregister = registerLayoutSave(
      boardId,
      { saveTimerRef, queuedSaveRef, pendingSaveRef, isWorkerRunningRef },
      flushQueuedSave,
    );

    return () => {
      isDraggingRef.current = false;
      flushQueuedSave();
      unregister();
    };
  }, [boardId, flushQueuedSave, isDraggingRef, registerLayoutSave]);

  /** SCHEDULE PENDING SAVE */
  const schedulePendingSave = () => {
    clearSaveTimer();
    if (isDraggingRef.current || !queuedSaveRef.current) return;

    saveTimerRef.current = setTimeout(flushQueuedSave, SAVE_DEBOUNCE_MS);
  };

  /** REQUEST LAYOUT SAVE */
  const requestLayoutSave = (nextLayout: BoardLayout) => {
    const job = {
      version: saveVersionRef.current + 1,
      layout: nextLayout,
    };

    saveVersionRef.current = job.version;
    queuedSaveRef.current = job;
    trackLayoutSave(boardId);
  };

  return { clearSaveTimer, requestLayoutSave, schedulePendingSave };
}
