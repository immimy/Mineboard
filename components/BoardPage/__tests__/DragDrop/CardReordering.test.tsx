import {
  advanceBoardSaveDebounce,
  dragAndDrop,
  expectCardOrder,
  getAllElements,
  renderBoard,
  useFakeBoardSaveTimer,
} from './testUtils';
import { saveBoardLayout } from '@/utils/actions/board';
import { serverLayout } from './testMocks';

const saveBoardLayoutMock = vi.mocked(saveBoardLayout);

describe('Card reordering', () => {
  it('reorders cards from the card handle', async () => {
    useFakeBoardSaveTimer();
    await renderBoard();
    const { card, cardHandle } = getAllElements();

    await dragAndDrop(cardHandle('Card A'), card('Card B'));

    await expectCardOrder(['Card B', 'Card A', 'Card C']);
    await advanceBoardSaveDebounce();

    expect(saveBoardLayoutMock).toHaveBeenCalledTimes(1);
    expect(saveBoardLayoutMock).toHaveBeenCalledWith('board-id', {
      ...serverLayout,
      cardIds: ['card-b', 'card-a', 'card-c'],
    });
  });
});
