import {
  expectCardOrder,
  expectListTextFieldValues,
  renderBoard,
} from './testUtils';

vi.mock(import('@/components/BoardPage/Card/CollapsibleCard'), async () => {
  const { ExpandedCardMock } = await import('./testMocks');
  return { default: ExpandedCardMock };
});

describe('Initial board layout', () => {
  it('renders the server card and list order', async () => {
    await renderBoard();

    await expectCardOrder(['Card A', 'Card B', 'Card C']);
    await expectListTextFieldValues('Card A', ['List one', 'List two']);
    await expectListTextFieldValues('Card B', []);
    await expectListTextFieldValues('Card C', ['List three']);
  });
});
