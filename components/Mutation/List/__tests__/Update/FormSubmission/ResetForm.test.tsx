import {
  getAllElements,
  openUpdateListDialog,
  renderUpdateListDialog,
} from '../testUtils';

vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

describe('UpdateListDialog form submission', () => {
  it('resets unsaved edits when the dialog is closed', async () => {
    renderUpdateListDialog();

    const { cancelButton, textInput } = getAllElements();

    await openUpdateListDialog();
    await textInput.fill('Temporary note');
    await expect.element(textInput).toHaveValue('Temporary note');

    await cancelButton.click();
    await openUpdateListDialog();

    await expect.element(textInput).toHaveValue('Start with Atomic Habits');
  });
});
