import {
  mockBoardId,
  mockCheckboxId,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import * as listActions from '@/utils/actions/list';
import {
  getAllElements,
  openUpdateListDialog,
  renderUpdateListDialog,
} from '../testUtils';
import { mockListId, UPDATE_LIST_FAIL } from '../testMocks';

vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

beforeEach(() => {
  vi.mocked(listActions.updateList).mockResolvedValue(UPDATE_LIST_FAIL);
});

describe('UpdateListDialog input submission', () => {
  it('checkbox: calls updateList with correct value', async () => {
    renderUpdateListDialog();
    await openUpdateListDialog();

    const { checkboxList, saveButton } = getAllElements();
    const titleInput = checkboxList.getByPlaceholder('checklist');
    const checkboxInput = checkboxList.getByRole('checkbox');
    await titleInput.fill('Morning coffee');
    await checkboxInput.click();
    await saveButton.click();

    await vi.waitFor(() => {
      expect(listActions.updateList).toHaveBeenCalledWith(
        mockBoardId,
        mockListId,
        expect.objectContaining({
          [mockCheckboxId]: expect.objectContaining({
            value: {
              checked: true,
              title: 'Morning coffee',
            },
          }),
        }),
      );
    });
  });
});
