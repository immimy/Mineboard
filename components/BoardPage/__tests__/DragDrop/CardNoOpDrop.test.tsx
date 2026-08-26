import { saveBoardLayout } from '@/utils/actions/board';
import {
  dragAndDrop,
  expectCardOrder,
  getAllElements,
  renderBoard,
} from './testUtils';

const saveBoardLayoutMock = vi.mocked(saveBoardLayout);

describe('Unchanged card position', () => {
  it('does not save a card dropped back in its original position', async () => {
    await renderBoard();
    const { card, cardHandle } = getAllElements();

    await dragAndDrop(cardHandle('Card A'), card('Card A'));

    await expectCardOrder(['Card A', 'Card B', 'Card C']);
    expect(saveBoardLayoutMock).not.toHaveBeenCalled();
  });
});
