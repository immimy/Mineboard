import { saveBoardLayout } from '@/utils/actions/board';
import {
  dragAndDrop,
  expectListTextFieldValues,
  getAllElements,
  renderBoard,
} from './testUtils';

const saveBoardLayoutMock = vi.mocked(saveBoardLayout);

describe('Unchanged list position', () => {
  it('does not save a list dropped back in its original position', async () => {
    await renderBoard();
    const { listHandle } = getAllElements();

    await dragAndDrop(listHandle(0, 'Card A'), listHandle(0, 'Card A'));

    await expectListTextFieldValues('Card A', ['List one', 'List two']);
    expect(saveBoardLayoutMock).not.toHaveBeenCalled();
  });
});
