import {
  getAllElements,
  renderListFieldDialog,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { userEvent } from 'vitest/browser';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

describe('List field dialog unsaved close confirmation', () => {
  it('keeps the dialog open when canceling an unsaved close from the close button', async () => {
    await renderListFieldDialog();

    const {
      addFieldButton,
      alert,
      closeDialogButton,
      dialog,
      openDialogButton,
      titleInput,
    } = getAllElements();

    await openDialogButton.click();
    await addFieldButton.text.click();
    await titleInput.text.fill('Note');

    await closeDialogButton.click();

    await expect.element(alert.discardMessage).toBeVisible();

    await alert.cancelButton.click();

    await expect.element(alert.discardMessage).not.toBeInTheDocument();
    await expect.element(dialog).toBeVisible();
    await expect.element(titleInput.text).toHaveValue('Note');
  });

  it('closes the dialog after confirming an unsaved close', async () => {
    await renderListFieldDialog();

    const {
      addFieldButton,
      alert,
      closeDialogButton,
      dialog,
      openDialogButton,
      titleInput,
    } = getAllElements();

    await openDialogButton.click();
    await addFieldButton.text.click();
    await titleInput.text.fill('Note');

    await closeDialogButton.click();
    await alert.closeButton.click();

    await expect.element(dialog).not.toBeInTheDocument();
    await expect.element(titleInput.text).not.toBeInTheDocument();
  });

  it('uses the same unsaved confirmation when Headless UI requests the dialog to close', async () => {
    await renderListFieldDialog();

    const { addFieldButton, alert, dialog, openDialogButton, titleInput } =
      getAllElements();

    await openDialogButton.click();
    await addFieldButton.text.click();
    await titleInput.text.fill('Note');

    await userEvent.keyboard('{Escape}');

    await expect.element(alert.discardMessage).toBeVisible();

    await alert.cancelButton.click();

    await expect.element(alert.discardMessage).not.toBeInTheDocument();
    await expect.element(dialog).toBeVisible();
    await expect.element(titleInput.text).toHaveValue('Note');
  });
});
