import {
  advanceBoardSaveDebounce,
  dragAndDrop,
  expectListTextFieldValues,
  getAllElements,
  renderBoard,
  useFakeBoardSaveTimer,
} from './testUtils';
import { saveBoardLayout } from '@/utils/actions/board';
import { serverLayout } from './testMocks';

const saveBoardLayoutMock = vi.mocked(saveBoardLayout);

describe('Empty card drop target', () => {
  it('moves a list into an empty card', async () => {
    useFakeBoardSaveTimer();
    await renderBoard();
    const { card, listHandle } = getAllElements();

    await dragAndDrop(listHandle(0, 'Card A'), card('Card B'));

    await expectListTextFieldValues('Card A', ['List two']);
    await expectListTextFieldValues('Card B', ['List one']);
    await advanceBoardSaveDebounce();

    expect(saveBoardLayoutMock).toHaveBeenCalledTimes(1);
    expect(saveBoardLayoutMock).toHaveBeenCalledWith('board-id', {
      ...serverLayout,
      listIdsByCard: {
        ...serverLayout.listIdsByCard,
        'card-a': ['list-2'],
        'card-b': ['list-1'],
      },
    });
  });
});
