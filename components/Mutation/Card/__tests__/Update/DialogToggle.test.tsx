import {
  getAllElements,
  openUpdateCardDialog,
  renderUpdateCardDialog,
} from './testUtils';

vi.mock('@/utils/actions/card');

describe('UpdateCardDialog interaction', () => {
  it('dialog is opened/closed when clicking the open/cancel button', async () => {
    renderUpdateCardDialog();

    const { header, cancelButton, saveButton } = getAllElements();

    expect(header.query()).toBe(null);

    await openUpdateCardDialog();

    await expect.element(header).toBeVisible();
    await expect.element(cancelButton).toBeVisible();
    await expect.element(saveButton).toBeVisible();

    await cancelButton.click();

    expect(header.query()).toBe(null);
    expect(cancelButton.query()).toBe(null);
    expect(saveButton.query()).toBe(null);
  });
});
