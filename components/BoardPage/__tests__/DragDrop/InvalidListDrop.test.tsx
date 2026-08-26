import {
  dragAndDrop,
  expectListTextFieldValues,
  getAllElements,
  renderBoard,
} from './testUtils';
import { saveBoardLayout } from '@/utils/actions/board';

const saveBoardLayoutMock = vi.mocked(saveBoardLayout);

describe('Invalid list drop', () => {
  it('does not save a list dropped outside every card', async () => {
    await renderBoard();
    const { listHandle, outsideBoard } = getAllElements();

    await dragAndDrop(listHandle(0, 'Card A'), outsideBoard);

    await expectListTextFieldValues('Card A', ['List one', 'List two']);
    await expectListTextFieldValues('Card B', []);
    await expectListTextFieldValues('Card C', ['List three']);
    expect(saveBoardLayoutMock).not.toHaveBeenCalled();
  });
});
