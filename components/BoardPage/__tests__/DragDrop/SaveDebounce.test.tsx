import { saveBoardLayout } from '@/utils/actions/board';
import type { BoardLayout } from '@/utils/dragdrop/types';
import { serverLayout } from './testMocks';
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

describe('Drag save debounce', () => {
  it('coalesces consecutive drags into one save of the latest layout', async () => {
    useFakeBoardSaveTimer();
    await renderBoard();
    const { card, cardHandle } = getAllElements();

    await dragAndDrop(cardHandle('Card A'), card('Card C'));
    await dragAndDrop(cardHandle('Card B'), card('Card A'));

    await expectCardOrder(['Card C', 'Card A', 'Card B']);
    expect(saveBoardLayoutMock).not.toHaveBeenCalled();

    await advanceBoardSaveDebounce();

    const latestLayout: BoardLayout = {
      ...serverLayout,
      cardIds: ['card-c', 'card-a', 'card-b'],
    };
    expect(saveBoardLayoutMock).toHaveBeenCalledTimes(1);
    expect(saveBoardLayoutMock).toHaveBeenCalledWith('board-id', latestLayout);
  });
});
