import {
  getAllElements,
  openAddListDialog,
  renderAddListDialog,
} from '../testUtils';

// ───────────────────────────────────────────────────────────
// Mocks
// ───────────────────────────────────────────────────────────

vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

// ───────────────────────────────────────────────────────────
// Form submission
// ───────────────────────────────────────────────────────────

describe('AddListDialog form submission', () => {
  it('resets form fields when the dialog is closed', async () => {
    await renderAddListDialog();
    const { cancelButton, textList } = getAllElements();

    // Open the dialog
    await openAddListDialog();

    // Dirty the text field
    const textInput = textList.getByLabelText(/note/i);
    await textInput.fill('Temporary');
    expect(textInput).toHaveValue('Temporary');

    // Close&Re-open the dialog
    await cancelButton.click();
    await openAddListDialog();

    // Text input is reset to the initial value
    expect(textInput).toHaveValue('');
  });
});
