import { toast } from 'react-toastify';
import { saveBoardLayout } from '@/utils/actions/board';
import { createDeferred } from './testMocks';
import {
  advanceBoardSaveDebounce,
  dragAndDrop,
  expectCardOrder,
  getAllElements,
  renderBoard,
  useFakeBoardSaveTimer,
} from './testUtils';

vi.mock('@/utils/actions/board', { spy: true });

const saveBoardLayoutMock = vi.mocked(saveBoardLayout);

describe('Stale save failure', () => {
  it('does not roll back a newer layout when an older save fails', async () => {
    useFakeBoardSaveTimer();
    const firstSave =
      createDeferred<Awaited<ReturnType<typeof saveBoardLayout>>>();
    saveBoardLayoutMock
      .mockReturnValueOnce(firstSave.promise)
      .mockResolvedValueOnce({ error: null });
    await renderBoard();
    const { card, cardHandle } = getAllElements();

    await dragAndDrop(cardHandle('Card A'), card('Card C'));
    await advanceBoardSaveDebounce();
    expect(saveBoardLayoutMock).toHaveBeenCalledTimes(1);

    await dragAndDrop(cardHandle('Card B'), card('Card A'));
    await expectCardOrder(['Card C', 'Card A', 'Card B']);
    await advanceBoardSaveDebounce();
    expect(saveBoardLayoutMock).toHaveBeenCalledTimes(1);

    firstSave.resolve({ data: null, error: 'Older save failed' });

    await vi.waitFor(() => {
      expect(saveBoardLayoutMock).toHaveBeenCalledTimes(2);
    });
    await expectCardOrder(['Card C', 'Card A', 'Card B']);
    expect(toast.error).not.toHaveBeenCalled();
  });
});
