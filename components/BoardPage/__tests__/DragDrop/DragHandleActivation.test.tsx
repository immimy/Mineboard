import {
  dragAndDrop,
  expectListTextFieldValues,
  getAllElements,
  renderBoard,
} from './testUtils';
import { saveBoardLayout } from '@/utils/actions/board';

vi.mock(import('@/components/BoardPage/Card/CollapsibleCard'), async () => {
  const { ExpandedCardMock } = await import('./testMocks');
  return { default: ExpandedCardMock };
});

const saveBoardLayoutMock = vi.mocked(saveBoardLayout);

describe('Drag handle activation', () => {
  it('does not start list sorting outside the configured handle', async () => {
    await renderBoard();
    const { card, listHandle } = getAllElements();
    const listHandleLocator = listHandle(0, 'Card A');
    await expect.element(listHandleLocator).toBeVisible();
    const listElement = listHandleLocator.element().closest('li');

    expect(listElement).not.toBeNull();
    await dragAndDrop(listElement!, card('Card B'));

    await expectListTextFieldValues('Card A', ['List one', 'List two']);
    await expectListTextFieldValues('Card B', []);
    expect(saveBoardLayoutMock).not.toHaveBeenCalled();
  });
});
