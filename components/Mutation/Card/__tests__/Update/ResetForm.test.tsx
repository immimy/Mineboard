import {
  getAllElements,
  openUpdateCardDialog,
  renderUpdateCardDialog,
} from './testUtils';

vi.mock('@/utils/actions/card');

describe('UpdateCardDialog form submission', () => {
  it('resets unsaved edits when the dialog is closed', async () => {
    renderUpdateCardDialog();

    const { cancelButton, titleInput, firstPalette, thirdPalette } =
      getAllElements();

    await openUpdateCardDialog();
    await titleInput.fill('Temporary update');
    await thirdPalette.click();
    await expect.element(titleInput).toHaveValue('Temporary update');
    await expect.element(thirdPalette).toBeChecked();

    await cancelButton.click();
    await openUpdateCardDialog();

    await expect.element(titleInput).toHaveValue('Test Card');
    await expect.element(firstPalette).toBeChecked();
  });
});
