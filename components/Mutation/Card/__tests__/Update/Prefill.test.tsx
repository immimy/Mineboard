import {
  getAllElements,
  openUpdateCardDialog,
  renderUpdateCardDialog,
} from './testUtils';
import { secondUpdateCardForm } from './testMocks';

vi.mock('@/utils/actions/card');

describe('UpdateCardDialog interaction', () => {
  it('prefills the selected card values', async () => {
    renderUpdateCardDialog();

    const { header, description, titleInput, firstPalette } = getAllElements();

    await expect.element(header).not.toBeInTheDocument();

    await openUpdateCardDialog();

    await expect.element(header).toBeVisible();
    await expect.element(description).toBeVisible();
    await expect.element(titleInput).toHaveValue('Test Card');
    await expect.element(firstPalette).toBeChecked();
  });

  it('prefills the form passed to the open button', async () => {
    renderUpdateCardDialog({ initialForm: secondUpdateCardForm });

    const { openButton, titleInput, secondPalette } = getAllElements();

    await openButton.click();

    await expect.element(titleInput).toHaveValue(secondUpdateCardForm.title);
    await expect.element(secondPalette).toBeChecked();
  });
});
