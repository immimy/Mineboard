import { useLayoutEffect, useRef, useState } from 'react';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import BoardLayoutSync from '../BoardLayoutSync';
import LayoutMutationSyncProvider, {
  useLayoutMutationSync,
} from '../LayoutMutationSyncProvider';
import type { BoardLayoutSaveJob } from '@/utils/dragdrop/types';

vi.mock('@/components/BoardPage/Board/BoardContainer', () => ({
  default: () => <div>Board ready</div>,
}));

const boardId = 'board-id';

it('waits for previous layout work before mounting the board', async () => {
  let finishSave: (() => void) | undefined;

  function PendingBoardEntry() {
    const { registerLayoutSave, trackLayoutSave, completeLayoutSave } =
      useLayoutMutationSync();

    const [registered, setRegistered] = useState(false);
    const refs = useRef<Parameters<typeof registerLayoutSave>[1]>({
      saveTimerRef: { current: null },
      queuedSaveRef: { current: null },
      pendingSaveRef: {
        current: {
          version: 1,
          layout: { cardIds: [], listIdsByCard: {} },
        } satisfies BoardLayoutSaveJob,
      },
      isWorkerRunningRef: { current: true },
    });

    // Mock the pending layout save before mounting `BoardLayoutSync`
    useLayoutEffect(() => {
      const unregister = registerLayoutSave(boardId, refs.current, () => {});
      trackLayoutSave(boardId);
      finishSave = () => {
        refs.current.pendingSaveRef.current = null;
        refs.current.isWorkerRunningRef.current = false;
        completeLayoutSave(boardId);
      };
      setRegistered(true);
      return unregister;
    }, [registerLayoutSave, trackLayoutSave, completeLayoutSave]);

    return registered ? (
      <BoardLayoutSync boardId={boardId} userId='user-id' />
    ) : null;
  }

  await render(
    <LayoutMutationSyncProvider>
      <PendingBoardEntry />
    </LayoutMutationSyncProvider>,
  );

  // Asserts that if there is a pending layout save, the board should display
  // loading component instead of the board content.
  await vi.waitFor(() => expect(finishSave).toBeTypeOf('function'));
  await expect.element(page.getByText('Board ready')).not.toBeInTheDocument();
  expect(document.querySelector('[aria-label="loading"]')).not.toBeNull();

  // Asserts that the board displays the content after the save resolves.
  finishSave?.();
  await expect.element(page.getByText('Board ready')).toBeVisible();
});
