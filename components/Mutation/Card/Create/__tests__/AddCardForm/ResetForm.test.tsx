import { getAllElements, renderAddCardDialog } from '../testUtils';

vi.mock('@/utils/actions/card');

describe('AddCardDialog form submission', () => {
  it('resets form fields when the dialog is closed', async () => {
    await renderAddCardDialog();
    const {
      addCardDialogButton,
      cancelButton,
      titleInput,
      firstPalette,
      thirdPalette,
    } = getAllElements();

    await addCardDialogButton.click();

    await titleInput.fill('Temporary');
    await thirdPalette.click();
    expect(titleInput).toHaveValue('Temporary');
    expect(thirdPalette).toBeChecked();

    await cancelButton.click();
    await addCardDialogButton.click();

    expect(titleInput).toHaveValue('');
    expect(firstPalette).toBeChecked();
  });
});
