import * as boardActions from '@/utils/actions/board';
import { getAllElements, renderAddBoardActionButton } from '../testUtils';

vi.mock('@/utils/actions/board');

describe('AddBoardActionButton form validation', () => {
  it('blocks empty title submission', async () => {
    await renderAddBoardActionButton();

    const { createBoardButton, titleInput } = getAllElements();

    await createBoardButton.click();

    expect(createBoardButton).toBeDisabled();
    expect(titleInput).toBeVisible();
    expect(boardActions.createBoard).not.toHaveBeenCalled();
  });

  it('blocks whitespace-only titles', async () => {
    await renderAddBoardActionButton();

    const { createBoardButton, titleInput, requiredError } = getAllElements();

    await createBoardButton.click();
    await titleInput.fill('   ');

    expect(requiredError).toBeVisible();
    expect(createBoardButton).toBeDisabled();
    expect(boardActions.createBoard).not.toHaveBeenCalled();
  });

  it('blocks titles over 30 characters after trimming', async () => {
    await renderAddBoardActionButton();

    const { createBoardButton, titleInput, maxLengthError } = getAllElements();

    await createBoardButton.click();
    await titleInput.fill(` ${'A'.repeat(31)} `);

    expect(maxLengthError).toBeVisible();
    expect(createBoardButton).toBeDisabled();
    expect(boardActions.createBoard).not.toHaveBeenCalled();
  });
});
