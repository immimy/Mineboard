import * as listActions from '@/utils/actions/list';
import {
  getAllElements,
  openUpdateListDialog,
  renderUpdateListDialog,
} from '../testUtils';
import { UPDATE_LIST_SUCCESS } from '../testMocks';

vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

beforeEach(() => {
  vi.mocked(listActions.updateList).mockResolvedValue(UPDATE_LIST_SUCCESS);
});

describe('UpdateListDialog form submission', () => {
  it('closes the dialog after the success', async () => {
    renderUpdateListDialog();

    const { header, saveButton, textInput } = getAllElements();

    await openUpdateListDialog();
    await textInput.fill('Close list');
    await saveButton.click();

    await vi.waitFor(() => {
      expect(header.query()).toBe(null);
    });
  });
});
