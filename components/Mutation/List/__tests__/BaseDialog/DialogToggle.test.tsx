import { getAllElements, openListDialog, renderListDialog } from './testUtils';

describe('ListDialog interaction', () => {
  it('dialog is opened/closed when clicking the open/cancel button', async () => {
    renderListDialog();

    const { header, cancelButton, saveButton } = getAllElements();

    // Dialog is closed initially
    expect(header.query()).toBe(null);
    // Open dialog
    await openListDialog();
    // Assertions: dialog is opened
    expect(header).toBeVisible();
    expect(cancelButton).toBeVisible();
    expect(saveButton).toBeVisible();
    // Close dialog
    await cancelButton.click();
    // Assertions: dialog is opened
    expect(header.query()).toBe(null);
    expect(cancelButton.query()).toBe(null);
    expect(saveButton.query()).toBe(null);
  });
});
