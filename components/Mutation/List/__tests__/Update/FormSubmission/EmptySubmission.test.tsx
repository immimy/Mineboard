import * as listActions from '@/utils/actions/list';
import { toast } from 'react-toastify';
import {
  getAllElements,
  openUpdateListDialog,
  renderUpdateListDialog,
} from '../testUtils';
import { emptyUpdateListInput } from '../testMocks';

vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

describe('UpdateListDialog form submission', () => {
  it('blocks empty submission and keeps dialog open', async () => {
    renderUpdateListDialog({ initialInput: emptyUpdateListInput });

    const { header, saveButton } = getAllElements();

    await openUpdateListDialog();
    await saveButton.click();

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'At least one field must have a value',
      );
    });
    expect(listActions.updateList).not.toHaveBeenCalled();
    await expect.element(header).toBeVisible();
  });
});
