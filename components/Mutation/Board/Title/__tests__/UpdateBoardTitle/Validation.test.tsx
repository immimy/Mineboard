import * as boardActions from '@/utils/actions/board';
import { page, userEvent } from 'vitest/browser';
import { getAllElements, renderUpdateBoardTitle } from './testUtils';

vi.mock('@/utils/actions/board');

describe('UpdateBoardTitle validation', () => {
  it('blocks whitespace-only titles', async () => {
    await renderUpdateBoardTitle();

    const { titleInput, updateButton, saveButton } = getAllElements();
    const requiredError = page.getByText(/board title is required/i);

    await userEvent.click(updateButton());
    await titleInput.fill('   ');

    await expect.element(requiredError).toBeInTheDocument();
    await expect.element(saveButton).toBeDisabled();
    await saveButton.click({ force: true });
    expect(boardActions.updateBoardTitle).not.toHaveBeenCalled();
  });

  it('blocks titles over 30 characters after trimming', async () => {
    await renderUpdateBoardTitle();

    const { titleInput, updateButton, saveButton } = getAllElements();
    const maxLengthError = page.getByText(
      /title must not exceed 30 characters/i,
    );

    await userEvent.click(updateButton());
    await titleInput.fill(` ${'A'.repeat(31)} `);

    await expect.element(maxLengthError).toBeInTheDocument();
    await expect.element(saveButton).toBeDisabled();
    await saveButton.click({ force: true });
    expect(boardActions.updateBoardTitle).not.toHaveBeenCalled();
  });
});
