import { getAllElements, renderAddCardDialog } from '../testUtils';

vi.mock('@/utils/actions/card');

describe('AddCardDialog interaction', () => {
  it('dialog is opened/closed when clicking the open/cancel button', async () => {
    await renderAddCardDialog();

    const { addCardDialogButton, header, cancelButton, saveButton } =
      getAllElements();

    expect(header.query()).toBe(null);

    await addCardDialogButton.click();

    expect(header).toBeVisible();
    expect(cancelButton).toBeVisible();
    expect(saveButton).toBeVisible();

    await cancelButton.click();

    expect(header.query()).toBe(null);
    expect(cancelButton.query()).toBe(null);
    expect(saveButton.query()).toBe(null);
  });
});
