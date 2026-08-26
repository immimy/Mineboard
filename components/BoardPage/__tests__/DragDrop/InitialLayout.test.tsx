import {
  expectCardOrder,
  expectListTextFieldValues,
  renderBoard,
} from './testUtils';

describe('Initial board layout', () => {
  it('renders the server card and list order', async () => {
    await renderBoard();

    await expectCardOrder(['Card A', 'Card B', 'Card C']);
    await expectListTextFieldValues('Card A', ['List one', 'List two']);
    await expectListTextFieldValues('Card B', []);
    await expectListTextFieldValues('Card C', ['List three']);
  });
});
