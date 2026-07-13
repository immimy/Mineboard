import { userEvent } from 'vitest/browser';
import { getAllElements, openActionMenu, renderActionMenu } from './testUtils';

describe('ActionMenu Update board title action', () => {
  it('enables and focuses the board title input from the menu', async () => {
    await renderActionMenu();
    const { editBoardTitleButton, boardTitleInput } = getAllElements();

    await expect.element(boardTitleInput).toHaveValue('Test Board');
    await expect.element(boardTitleInput).toBeDisabled();

    await openActionMenu();
    await userEvent.click(editBoardTitleButton);

    await expect.element(boardTitleInput).toBeEnabled();
    await expect.element(boardTitleInput).toHaveFocus();
  });
});
