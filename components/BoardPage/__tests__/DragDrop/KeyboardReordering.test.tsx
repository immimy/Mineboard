import { userEvent } from 'vitest/browser';
import { saveBoardLayout } from '@/utils/actions/board';
import { serverLayout } from './testMocks';
import {
  advanceBoardSaveDebounce,
  expectCardOrder,
  getAllElements,
  renderBoard,
  useFakeBoardSaveTimer,
  waitForDndToSettle,
} from './testUtils';

const saveBoardLayoutMock = vi.mocked(saveBoardLayout);
const TAILWIND_MD_BREAKPOINT_PX = 768;

describe('Keyboard reordering', () => {
  it('moves and saves a card using the keyboard sensor', async () => {
    useFakeBoardSaveTimer();
    await renderBoard();
    const { cardHandle } = getAllElements();
    const firstCardHandle = cardHandle('Card A');
    const moveKey =
      window.innerWidth >= TAILWIND_MD_BREAKPOINT_PX
        ? 'ArrowRight'
        : 'ArrowDown';

    firstCardHandle.element().focus();
    await userEvent.keyboard(`{Space}{${moveKey}}{Space}`);
    await waitForDndToSettle();

    await expectCardOrder(['Card B', 'Card A', 'Card C']);
    await advanceBoardSaveDebounce();

    expect(saveBoardLayoutMock).toHaveBeenCalledTimes(1);
    expect(saveBoardLayoutMock).toHaveBeenCalledWith('board-id', {
      ...serverLayout,
      cardIds: ['card-b', 'card-a', 'card-c'],
    });
  });
});
