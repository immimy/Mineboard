import * as listActions from '@/utils/actions/list';
import { toast } from 'react-toastify';
import {
  getAllElements,
  openUpdateListDialog,
  renderUpdateListDialog,
} from '../testUtils';
import { missingListIdInput, UPDATE_LIST_FAIL } from '../testMocks';

vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

beforeEach(() => {
  vi.mocked(listActions.updateList).mockResolvedValue(UPDATE_LIST_FAIL);
});

describe('UpdateListDialog form submission', () => {
  it('shows an error toast and keeps dialog open when updateList fails', async () => {
    renderUpdateListDialog();

    const { header, saveButton, textInput } = getAllElements();

    await openUpdateListDialog();
    await textInput.fill('Keep dialog open');
    await saveButton.click();
    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update list');
    });
    await expect.element(header).toBeVisible();
  });

  it('shows a guard error and does not call updateList when no list is selected', async () => {
    renderUpdateListDialog({ initialInput: missingListIdInput });

    const { header, saveButton } = getAllElements();

    await openUpdateListDialog();
    await saveButton.click();

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('List is not selected');
    });
    expect(listActions.updateList).not.toHaveBeenCalled();
    await expect.element(header).toBeVisible();
  });
});
