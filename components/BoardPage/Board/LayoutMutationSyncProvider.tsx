'use client';

import {
  createContext,
  type PropsWithChildren,
  type RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import type { FormState } from '@/types/app';
import { renderError } from '@/components/global/utils';
import type { BoardLayoutSaveJob } from '@/utils/dragdrop/types';

type LayoutSaveRefs = {
  saveTimerRef: RefObject<ReturnType<typeof setTimeout> | null>;
  queuedSaveRef: RefObject<BoardLayoutSaveJob | null>;
  pendingSaveRef: RefObject<BoardLayoutSaveJob | null>;
  isWorkerRunningRef: RefObject<boolean>;
};

function createCompletion() {
  let resolve!: () => void;
  const promise = new Promise<void>((complete) => {
    resolve = complete;
  });
  return { promise, resolve };
}

type LayoutSaveRegistration = LayoutSaveRefs & {
  flushQueuedSave: () => void;
  active: boolean;
  completion: ReturnType<typeof createCompletion> | null;
  rollbackStatus: 'pending' | 'handled' | null;
};

type LayoutMutationSyncActions = {
  getPendingLayoutSave: (boardId: string) => Promise<void> | null;
  registerLayoutSave: (
    boardId: string,
    refs: LayoutSaveRefs,
    flushQueuedSave: () => void,
  ) => () => void;
  trackLayoutSave: (boardId: string) => void;
  completeLayoutSave: (boardId: string) => void;
  setLayoutRollbackStatus: (
    boardId: string,
    status: 'pending' | 'handled' | 'committed',
  ) => void;
  waitForLayoutSaves: (boardId: string) => Promise<void>;
  runMutation: (
    boardId: string,
    mutation: () => Promise<FormState>,
  ) => Promise<FormState>;
};

const LayoutMutationSyncContext = createContext<
  LayoutMutationSyncActions | undefined
>(undefined);

export function useLayoutMutationSync() {
  const actions = useContext(LayoutMutationSyncContext);
  if (!actions) {
    throw new Error(
      'useLayoutMutationSync must be used in LayoutMutationSyncProvider',
    );
  }
  return actions;
}

/**
 * Owns one registration and save-cycle completion promise per board.
 * Retains unfinished work across navigation; dashboard entry waits before
 * mounting the next board query and drag area.
 * Dialogs own submitting state; the drag area owns layout jobs and rollback.
 */
function LayoutMutationSyncProvider({ children }: PropsWithChildren) {
  const layoutSavesRef = useRef(new Map<string, LayoutSaveRegistration>());

  // Gets the promise used for tracking the save cycle (if exists)
  // - Promise: wait till the cycle finish
  // - Null: show board at once
  const getPendingLayoutSave = useCallback((boardId: string) => {
    const save = layoutSavesRef.current.get(boardId);
    return save?.completion?.promise ?? null;
  }, []);

  // The layout save cycle finishes when
  // - No queued save and timer ref
  // - No pending save and active worker
  // - Rollback is already done in case of failure
  const completeLayoutSave = useCallback((boardId: string) => {
    const save = layoutSavesRef.current.get(boardId);
    if (
      !save ||
      save.saveTimerRef.current ||
      save.queuedSaveRef.current ||
      save.pendingSaveRef.current ||
      save.isWorkerRunningRef.current ||
      save.rollbackStatus !== null
    )
      return;

    const completion = save.completion;
    save.completion = null;
    if (!save.active) layoutSavesRef.current.delete(boardId);
    completion?.resolve();
  }, []);

  // Registers the layout save refs to this provider
  const registerLayoutSave = useCallback(
    (boardId: string, refs: LayoutSaveRefs, flushQueuedSave: () => void) => {
      const previous = layoutSavesRef.current.get(boardId);
      // Dashboard entry waits for old work. Keep this guard so a different
      // instance cannot accidentally replace an unfinished registration.
      if (previous && previous.isWorkerRunningRef !== refs.isWorkerRunningRef) {
        throw new Error(
          'The previous board layout registration is still active',
        );
      }

      const save = previous ?? {
        ...refs,
        flushQueuedSave,
        active: true,
        completion: null,
        rollbackStatus: null,
      };
      if (previous) {
        save.active = true;
        save.flushQueuedSave = flushQueuedSave;
      }
      layoutSavesRef.current.set(boardId, save);

      return () => {
        if (layoutSavesRef.current.get(boardId) !== save) return;
        // The caller flushes its queued work before unregistering. Keep any
        // in-flight work registered, but there is no unmounted UI to roll back.
        save.active = false;
        save.rollbackStatus = null;
        completeLayoutSave(boardId);
      };
    },
    [completeLayoutSave],
  );

  // Tracks the save cycle with promise when the save request is triggered.
  const trackLayoutSave = useCallback((boardId: string) => {
    const save = layoutSavesRef.current.get(boardId);
    if (!save) throw new Error('Layout saving is not registered');

    // More drags extend this same cycle; they do not replace its promise.
    save.completion ??= createCompletion();
  }, []);

  // Set rollback status
  // - pending: There is pending rollback.
  // - handled: The last stable layout is scheduled in state updater.
  // - committed: The UI is already reversed to the stable one, release the wait.
  const setLayoutRollbackStatus = useCallback(
    (boardId: string, status: 'pending' | 'handled' | 'committed') => {
      const save = layoutSavesRef.current.get(boardId);
      if (!save?.active) return;

      if (status === 'committed') {
        // A render from before failure handling must not release the wait.
        if (save.rollbackStatus !== 'handled') return;
        save.rollbackStatus = null;
      } else {
        save.rollbackStatus = status;
      }
      completeLayoutSave(boardId);
    },
    [completeLayoutSave],
  );

  // Flushes queued save and waits till the layout save cycle finishes
  const waitForLayoutSaves = useCallback(async (boardId: string) => {
    while (true) {
      const save = layoutSavesRef.current.get(boardId);
      const completion = save?.completion;
      // No registration is normal before the board's first mount.
      if (!save || !completion) return;

      save.flushQueuedSave();
      // Normal save failures resolve after handling. Recheck in case another
      // save cycle started while we were awaiting this one.
      await completion.promise;
    }
  }, []);

  // Mutations that affect the layout must wait for the background save cycle to be finished before running.
  const runMutation = useCallback(
    async (
      boardId: string,
      mutation: () => Promise<FormState>,
    ): Promise<FormState> => {
      if (!layoutSavesRef.current.has(boardId)) {
        return { error: 'The board is not ready. Please try again.' };
      }

      try {
        await waitForLayoutSaves(boardId);
        return await mutation();
      } catch (error) {
        return renderError(error, 'Failed to complete the board change');
      }
    },
    [waitForLayoutSaves],
  );

  const actions = useMemo(
    () => ({
      getPendingLayoutSave,
      registerLayoutSave,
      trackLayoutSave,
      completeLayoutSave,
      setLayoutRollbackStatus,
      waitForLayoutSaves,
      runMutation,
    }),
    [
      getPendingLayoutSave,
      registerLayoutSave,
      trackLayoutSave,
      completeLayoutSave,
      setLayoutRollbackStatus,
      waitForLayoutSaves,
      runMutation,
    ],
  );

  return (
    <LayoutMutationSyncContext.Provider value={actions}>
      {children}
    </LayoutMutationSyncContext.Provider>
  );
}

export default LayoutMutationSyncProvider;
