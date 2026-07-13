import {
  mockBoardId,
  mockNumberId,
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
  it('number: calls updateList with correct value', async () => {
    renderUpdateListDialog();
    await openUpdateListDialog();

    const { numberList, saveButton } = getAllElements();
    const numberInput = numberList.getByLabelText(/estimate/i);

    await numberInput.fill('4');
    await saveButton.click();

    await vi.waitFor(() => {
      expect(listActions.updateList).toHaveBeenCalledWith(
        mockBoardId,
        mockListId,
        expect.objectContaining({
          [mockNumberId]: expect.objectContaining({
            value: '4',
          }),
        }),
      );
    });
  });
});
