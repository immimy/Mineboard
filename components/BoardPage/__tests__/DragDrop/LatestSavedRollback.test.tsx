import { toast } from 'react-toastify';
import { saveBoardLayout } from '@/utils/actions/board';
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

describe('Latest saved layout rollback', () => {
  it('restores the latest successful layout when a later save fails', async () => {
    useFakeBoardSaveTimer();
    saveBoardLayoutMock
      .mockResolvedValueOnce({ error: null })
      .mockResolvedValueOnce({ data: null, error: 'Saving failed' });
    await renderBoard();
    const { card, cardHandle } = getAllElements();

    await dragAndDrop(cardHandle('Card A'), card('Card C'));
    await advanceBoardSaveDebounce();
    await vi.waitFor(() => {
      expect(saveBoardLayoutMock).toHaveBeenCalledTimes(1);
    });
    await expectCardOrder(['Card B', 'Card C', 'Card A']);

    await dragAndDrop(cardHandle('Card B'), card('Card A'));
    await expectCardOrder(['Card C', 'Card A', 'Card B']);
    await advanceBoardSaveDebounce();

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to save the latest board layout. The last saved order was restored.',
      );
    });
    expect(saveBoardLayoutMock).toHaveBeenCalledTimes(2);
    await expectCardOrder(['Card B', 'Card C', 'Card A']);
  });
});
