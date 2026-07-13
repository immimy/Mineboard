import {
  getAllElements,
  openUpdateListDialog,
  renderUpdateListDialog,
} from '../testUtils';

vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

describe('UpdateListDialog interaction', () => {
  it('dialog is opened/closed when clicking the open/cancel button', async () => {
    renderUpdateListDialog();

    const { header, cancelButton, saveButton } = getAllElements();

    expect(header.query()).toBe(null);

    await openUpdateListDialog();

    await expect.element(header).toBeVisible();
    await expect.element(cancelButton).toBeVisible();
    await expect.element(saveButton).toBeVisible();

    await cancelButton.click();

    expect(header.query()).toBe(null);
    expect(cancelButton.query()).toBe(null);
    expect(saveButton.query()).toBe(null);
  });
});
