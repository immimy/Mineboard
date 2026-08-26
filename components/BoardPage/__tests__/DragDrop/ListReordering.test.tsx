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

describe('List reordering', () => {
  it('reorders lists within a card through the real sortable target', async () => {
    useFakeBoardSaveTimer();
    await renderBoard();
    const { listHandle } = getAllElements();

    await dragAndDrop(listHandle(0, 'Card A'), listHandle(1, 'Card A'));

    await expectListTextFieldValues('Card A', ['List two', 'List one']);
    await advanceBoardSaveDebounce();

    expect(saveBoardLayoutMock).toHaveBeenCalledTimes(1);
    expect(saveBoardLayoutMock).toHaveBeenCalledWith('board-id', {
      ...serverLayout,
      listIdsByCard: {
        ...serverLayout.listIdsByCard,
        'card-a': ['list-2', 'list-1'],
      },
    });
  });
});
