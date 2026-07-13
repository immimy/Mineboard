import * as boardActions from '@/utils/actions/board';
import { userEvent } from 'vitest/browser';
import { getAllElements, renderAddBoardTitle } from './testUtils';

vi.mock('@/utils/actions/board');

describe('AddBoardActionButton interaction', () => {
  it('opens and cancels the inline form', async () => {
    await renderAddBoardTitle();

    const { createBoardButton, titleInput, cancelButton } = getAllElements();

    expect(titleInput.query()).toBe(null);

    await createBoardButton.click();

    expect(titleInput).toBeVisible();
    expect(cancelButton).toBeVisible();
    await expect.element(titleInput).toHaveFocus();

    await titleInput.fill('Temporary board');
    await cancelButton.click();

    expect(titleInput.query()).toBe(null);

    await createBoardButton.click();

    expect(titleInput).toHaveValue('');
    expect(boardActions.createBoard).not.toHaveBeenCalled();
  });

  it('cancels the inline form with Escape', async () => {
    await renderAddBoardTitle();

    const { createBoardButton, titleInput } = getAllElements();

    await createBoardButton.click();
    await titleInput.fill('Draft board');
    await userEvent.keyboard('{Escape}');

    expect(titleInput.query()).toBe(null);
    expect(boardActions.createBoard).not.toHaveBeenCalled();
  });

  it('does not open when disabled', async () => {
    await renderAddBoardTitle({ isDisabled: true });

    const { createBoardButton, titleInput } = getAllElements();

    expect(createBoardButton).toBeDisabled();
    await createBoardButton.click({ force: true });

    expect(titleInput.query()).toBe(null);
  });

  it('does not open without a user id', async () => {
    await renderAddBoardTitle({ userId: '' });

    const { createBoardButton, titleInput } = getAllElements();

    await createBoardButton.click();

    expect(titleInput.query()).toBe(null);
  });
});
