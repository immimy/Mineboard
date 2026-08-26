import { createDeferred, serverLayout } from './testMocks';
import {
  advanceBoardSaveDebounce,
  dragAndDrop,
  expectCardOrder,
  getAllElements,
  renderBoard,
  useFakeBoardSaveTimer,
} from './testUtils';
import { saveBoardLayout } from '@/utils/actions/board';
import type { BoardLayout } from '@/utils/dragdrop/types';

vi.mock('@/utils/actions/board', { spy: true });

const saveBoardLayoutMock = vi.mocked(saveBoardLayout);

describe('Drag save queue', () => {
  it('starts the queued job after the active job completes', async () => {
    useFakeBoardSaveTimer();
    const firstSave =
      createDeferred<Awaited<ReturnType<typeof saveBoardLayout>>>();
    saveBoardLayoutMock
      .mockReturnValueOnce(firstSave.promise)
      .mockResolvedValueOnce({ error: null });
    await renderBoard();
    const { card, cardHandle } = getAllElements();

    // First drag
    await dragAndDrop(cardHandle('Card A'), card('Card C'));
    const firstLayout: BoardLayout = {
      ...serverLayout,
      cardIds: ['card-b', 'card-c', 'card-a'],
    };
    await expectCardOrder(['Card B', 'Card C', 'Card A']);
    await advanceBoardSaveDebounce();
    expect(saveBoardLayoutMock).toHaveBeenCalledTimes(1);
    expect(saveBoardLayoutMock).toHaveBeenCalledWith('board-id', firstLayout);

    // Second drag
    await dragAndDrop(cardHandle('Card B'), card('Card A'));
    const latestLayout: BoardLayout = {
      ...serverLayout,
      cardIds: ['card-c', 'card-a', 'card-b'],
    };
    await expectCardOrder(['Card C', 'Card A', 'Card B']);
    await advanceBoardSaveDebounce();

    // Expect `saveBoardLayout` to be sequentially invoked.
    // The following function call should wait until the previous call succeed before proceeding.
    // So this function should be called once here because the first call is not resolved yet.
    expect(saveBoardLayoutMock).toHaveBeenCalledTimes(1);

    // Resolve the first saving attempt
    firstSave.resolve({ error: null });
    await firstSave.promise;

    // The worker resumes in the same microtask queue and consumes the latest job.
    expect(saveBoardLayoutMock).toHaveBeenCalledTimes(2);
    expect(saveBoardLayoutMock).toHaveBeenLastCalledWith(
      'board-id',
      latestLayout,
    );
  });
});
