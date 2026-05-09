import { getAllElements, renderAddListDialog } from '../testUtils';

// ───────────────────────────────────────────────────────────
// Mocks
// ───────────────────────────────────────────────────────────

vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

// ───────────────────────────────────────────────────────────
// Interaction
// ───────────────────────────────────────────────────────────

describe('AddListDialog interaction', () => {
  it('dialog is opened/closed when clicking the open/cancel button', async () => {
    await renderAddListDialog();

    const { addListDialogButton, header, cancelButton, saveButton } =
      getAllElements();

    // Dialog is closed initially
    expect(header.query()).toBe(null);
    // Open dialog
    await addListDialogButton.click();
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
