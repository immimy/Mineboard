import { useEffect, type PropsWithChildren } from 'react';
import { MockedProvider } from '@apollo/client/testing/react';
import { toast } from 'react-toastify';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import * as boardActions from '@/utils/actions/board';
import ActionMenuContainer from '@/components/BoardPage/ActionMenu/ActionMenuContainer';
import BoardContextProvider from '@/components/BoardPage/Board/BoardContext';
import LayoutMutationSyncProvider, {
  useLayoutMutationSync,
} from '@/components/BoardPage/Board/LayoutMutationSyncProvider';
import CardDeletionsProvider from '@/components/BoardPage/Card/CardDeletionsContext';
import { BoardTitleProvider } from '@/components/Mutation/Board/Title/BoardTitleContext';
import DialogsProvider from '@/components/Mutation/Context/DialogsProvider';
import { mockReplace } from '@/mocks/browser/next/navigation';
import type { BoardLayoutSaveJob } from '@/utils/dragdrop/types';
import { mockBoardId } from '../singleBoardQuery.mock';
import { createDeleteBoardCache, mockUserId } from './testMocks';
import { getAllElements, openActionMenu } from './testUtils';

vi.mock('@/utils/actions/board');

it('waits for a queued layout save before deleting the board', async () => {
  const deleteBoard = vi.mocked(boardActions.deleteBoard).mockResolvedValue({
    error: null,
  });
  const flushQueuedSave = vi.fn();
  let finishSave: (() => void) | undefined;

  function PendingLayoutRegistration() {
    const { registerLayoutSave, trackLayoutSave, completeLayoutSave } =
      useLayoutMutationSync();

    useEffect(() => {
      const refs: Parameters<typeof registerLayoutSave>[1] = {
        saveTimerRef: { current: null },
        queuedSaveRef: {
          current: {
            version: 1,
            layout: { cardIds: [], listIdsByCard: {} },
          } satisfies BoardLayoutSaveJob,
        },
        pendingSaveRef: { current: null },
        isWorkerRunningRef: { current: false },
      };
      const unregister = registerLayoutSave(mockBoardId, refs, () => {
        flushQueuedSave();
        refs.pendingSaveRef.current = refs.queuedSaveRef.current;
        refs.queuedSaveRef.current = null;
        refs.isWorkerRunningRef.current = true;
      });
      trackLayoutSave(mockBoardId);
      finishSave = () => {
        refs.pendingSaveRef.current = null;
        refs.isWorkerRunningRef.current = false;
        completeLayoutSave(mockBoardId);
      };
      return unregister;
    }, [registerLayoutSave, trackLayoutSave, completeLayoutSave]);

    return null;
  }

  function PendingLayoutSyncProvider({ children }: PropsWithChildren) {
    return (
      <LayoutMutationSyncProvider>
        <PendingLayoutRegistration />
        {children}
      </LayoutMutationSyncProvider>
    );
  }

  await render(
    <PendingLayoutSyncProvider>
      <MockedProvider cache={createDeleteBoardCache()}>
        <BoardTitleProvider>
          <BoardContextProvider boardId={mockBoardId} userId={mockUserId}>
            <CardDeletionsProvider>
              <DialogsProvider>
                <ActionMenuContainer />
              </DialogsProvider>
            </CardDeletionsProvider>
          </BoardContextProvider>
        </BoardTitleProvider>
      </MockedProvider>
    </PendingLayoutSyncProvider>,
  );
  await vi.waitFor(() => expect(finishSave).toBeTypeOf('function'));

  const { deleteBoardButton, confirmButton } = getAllElements();
  await openActionMenu();
  await userEvent.click(deleteBoardButton);
  await userEvent.click(confirmButton);

  try {
    await vi.waitFor(() => expect(flushQueuedSave).toHaveBeenCalledOnce());
    expect(deleteBoard).not.toHaveBeenCalled();
    await expect.element(confirmButton).toBeDisabled();
    await userEvent.keyboard('{Escape}');
    await userEvent.click(document.body, { position: { x: 0, y: 0 } });
    await expect
      .element(page.getByRole('dialog', { name: 'Confirm Deletion' }))
      .toBeVisible();
    expect(mockReplace).not.toHaveBeenCalled();
  } finally {
    finishSave?.();
  }

  await vi.waitFor(() => {
    expect(deleteBoard).toHaveBeenCalledWith(mockBoardId);
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });
  expect(toast.error).not.toHaveBeenCalled();
});
