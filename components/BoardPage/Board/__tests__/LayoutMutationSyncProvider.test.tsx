import { useEffect } from 'react';
import { render } from 'vitest-browser-react';
import LayoutMutationSyncProvider, {
  useLayoutMutationSync,
} from '../LayoutMutationSyncProvider';
import type { BoardLayoutSaveJob } from '@/utils/dragdrop/types';

type SyncActions = ReturnType<typeof useLayoutMutationSync>;
type LayoutSaveRefs = Parameters<SyncActions['registerLayoutSave']>[1];
const boardId = 'board-id';
const firstJob: BoardLayoutSaveJob = {
  version: 1,
  layout: { cardIds: ['card-a'], listIdsByCard: { 'card-a': [] } },
};
const secondJob: BoardLayoutSaveJob = {
  version: 2,
  layout: { cardIds: ['card-a'], listIdsByCard: { 'card-a': [] } },
};

function CaptureActions({
  onReady,
}: {
  onReady: (actions: SyncActions) => void;
}) {
  const actions = useLayoutMutationSync();
  useEffect(() => {
    onReady(actions);
  }, [actions, onReady]);
  return null;
}

async function renderSyncProvider() {
  let actions: SyncActions | undefined;
  await render(
    <LayoutMutationSyncProvider>
      <CaptureActions onReady={(nextActions) => (actions = nextActions)} />
    </LayoutMutationSyncProvider>,
  );
  await vi.waitFor(() => expect(actions).toBeDefined());
  return actions!;
}

function createRefs({
  queued = null,
  pending = null,
  running = false,
}: {
  queued?: BoardLayoutSaveJob | null;
  pending?: BoardLayoutSaveJob | null;
  running?: boolean;
} = {}): LayoutSaveRefs {
  return {
    saveTimerRef: { current: null },
    queuedSaveRef: { current: queued },
    pendingSaveRef: { current: pending },
    isWorkerRunningRef: { current: running },
  };
}

it('flushes a queued save and waits before running a mutation', async () => {
  // Mocks board registry
  const sync = await renderSyncProvider();
  const refs = createRefs({ queued: firstJob });
  const flushQueuedSave = vi.fn(() => {
    if (!refs.queuedSaveRef.current) return;
    refs.pendingSaveRef.current = refs.queuedSaveRef.current;
    refs.queuedSaveRef.current = null;
    refs.isWorkerRunningRef.current = true;
  });
  sync.registerLayoutSave(boardId, refs, flushQueuedSave);
  sync.trackLayoutSave(boardId);

  // Before running the mutation, ensures to flush the pending layout save
  const mutate = vi.fn().mockResolvedValue({ error: null });
  const result = sync.runMutation(boardId, mutate);
  await vi.waitFor(() => expect(flushQueuedSave).toHaveBeenCalledOnce());
  expect(mutate).not.toHaveBeenCalled();

  // Supplies the save as complete
  refs.pendingSaveRef.current = null;
  refs.isWorkerRunningRef.current = false;
  sync.completeLayoutSave(boardId);

  // Asserts that the mutation run after the layout save completion
  await expect(result).resolves.toEqual({ error: null });
  expect(mutate).toHaveBeenCalledOnce();
});

it('waits for newer queued work while an earlier save is running', async () => {
  // Mocks board registry
  const sync = await renderSyncProvider();
  const refs = createRefs({ pending: firstJob, running: true });
  const flushQueuedSave = vi.fn(() => {
    if (!refs.queuedSaveRef.current) return;
    refs.pendingSaveRef.current = refs.queuedSaveRef.current;
    refs.queuedSaveRef.current = null;
    refs.isWorkerRunningRef.current = true;
  });
  sync.registerLayoutSave(boardId, refs, flushQueuedSave);
  sync.trackLayoutSave(boardId);

  // Before running the mutation, ensures to flush the pending layout save
  const mutate = vi.fn().mockResolvedValue({ error: null });
  const result = sync.runMutation(boardId, mutate);
  await vi.waitFor(() => expect(flushQueuedSave).toHaveBeenCalledOnce());

  // Supplies the second job while marking the first job as complete
  refs.queuedSaveRef.current = secondJob;
  refs.pendingSaveRef.current = null;
  refs.isWorkerRunningRef.current = false;
  sync.completeLayoutSave(boardId);
  // Asserts that the mutation does not run until the save cycle finish
  expect(mutate).not.toHaveBeenCalled();

  flushQueuedSave();
  refs.pendingSaveRef.current = null;
  refs.isWorkerRunningRef.current = false;
  sync.completeLayoutSave(boardId);
  // Asserts that the mutation run once after the cycle finish
  await expect(result).resolves.toEqual({ error: null });
  expect(mutate).toHaveBeenCalledOnce();
});

it('waits for a failed save rollback to commit before mutating', async () => {
  // Mocks board registry
  const sync = await renderSyncProvider();
  const refs = createRefs({ pending: firstJob, running: true });
  sync.registerLayoutSave(boardId, refs, () => {});
  sync.trackLayoutSave(boardId);

  // Set the layout save fail and rollback is needed
  const mutate = vi.fn().mockResolvedValue({ error: null });
  const result = sync.runMutation(boardId, mutate);
  sync.setLayoutRollbackStatus(boardId, 'pending');
  refs.pendingSaveRef.current = null;
  refs.isWorkerRunningRef.current = false;
  sync.completeLayoutSave(boardId);
  // Asserts that the mutation does not run before the rollback completed
  expect(mutate).not.toHaveBeenCalled();

  sync.setLayoutRollbackStatus(boardId, 'handled');
  expect(mutate).not.toHaveBeenCalled();
  sync.setLayoutRollbackStatus(boardId, 'committed');
  // Asserts that the mutation does run after the rollback completed
  await expect(result).resolves.toEqual({ error: null });
  expect(mutate).toHaveBeenCalledOnce();
});
