import { saveBoardLayout } from '@/utils/actions/board';
import {
  dragAndDrop,
  expectCardOrder,
  getAllElements,
  renderBoard,
} from './testUtils';

vi.mock(import('@/components/BoardPage/Card/CollapsibleCard'), async () => {
  const { ExpandedCardMock } = await import('./testMocks');
  return { default: ExpandedCardMock };
});

const saveBoardLayoutMock = vi.mocked(saveBoardLayout);

describe('Invalid card drop', () => {
  it('restores the card order and does not save outside a card target', async () => {
    await renderBoard();
    const { cardHandle, outsideBoard } = getAllElements();

    await dragAndDrop(cardHandle('Card A'), outsideBoard);

    await expectCardOrder(['Card A', 'Card B', 'Card C']);
    expect(saveBoardLayoutMock).not.toHaveBeenCalled();
  });
});
