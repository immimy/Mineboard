import * as boardActions from '@/utils/actions/board';
import { userEvent } from 'vitest/browser';
import { getAllElements, renderUpdateBoardTitle } from './testUtils';

vi.mock('@/utils/actions/board');

describe('UpdateBoardTitle interaction', () => {
  it('enters edit mode from the pencil and focuses the title', async () => {
    await renderUpdateBoardTitle();

    const { titleInput, updateButton } = getAllElements();

    await expect.element(titleInput).toHaveValue('Test Board');
    await expect.element(titleInput).toBeDisabled();

    await userEvent.click(updateButton());

    await expect.element(titleInput).toBeEnabled();
    await expect.element(titleInput).toHaveFocus();
  });

  it('cancels and restores the previous title', async () => {
    await renderUpdateBoardTitle();

    const { titleInput, updateButton, cancelButton } = getAllElements();

    await userEvent.click(updateButton());
    await titleInput.fill('Temporary title');
    await userEvent.click(cancelButton);

    await expect.element(titleInput).toHaveValue('Test Board');
    await expect.element(titleInput).toBeDisabled();
    expect(boardActions.updateBoardTitle).not.toHaveBeenCalled();
  });

  it('cancels with Escape and restores the previous title', async () => {
    await renderUpdateBoardTitle();

    const { titleInput, updateButton } = getAllElements();

    await userEvent.click(updateButton());
    await titleInput.fill('Temporary title');
    await userEvent.keyboard('{Escape}');

    await expect.element(titleInput).toHaveValue('Test Board');
    await expect.element(titleInput).toBeDisabled();
    expect(boardActions.updateBoardTitle).not.toHaveBeenCalled();
  });
});
