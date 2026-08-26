import { saveBoardLayout } from '@/utils/actions/board';
import { serverLayout } from './testMocks';
import {
  advanceBoardSaveDebounce,
  dragAndDrop,
  expectListTextFieldValues,
  getAllElements,
  renderBoard,
  useFakeBoardSaveTimer,
} from './testUtils';

const saveBoardLayoutMock = vi.mocked(saveBoardLayout);

describe('Cross-card list movement', () => {
  it('moves a list into a card that already contains a list', async () => {
    useFakeBoardSaveTimer();
    await renderBoard();
    const { listHandle } = getAllElements();

    await dragAndDrop(listHandle(0, 'Card A'), listHandle(0, 'Card C'));

    await expectListTextFieldValues('Card A', ['List two']);
    await expectListTextFieldValues('Card C', ['List one', 'List three']);
    await advanceBoardSaveDebounce();

    expect(saveBoardLayoutMock).toHaveBeenCalledTimes(1);
    expect(saveBoardLayoutMock).toHaveBeenCalledWith('board-id', {
      ...serverLayout,
      listIdsByCard: {
        ...serverLayout.listIdsByCard,
        'card-a': ['list-2'],
        'card-c': ['list-1', 'list-3'],
      },
    });
  });
});
