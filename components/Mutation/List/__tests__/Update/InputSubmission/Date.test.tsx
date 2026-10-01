import {
  mockBoardId,
  mockDateId,
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
  it('date: calls updateList with correct value', async () => {
    renderUpdateListDialog();
    await openUpdateListDialog();

    const { dateList, saveButton } = getAllElements();
    const dateInput = dateList.getByLabelText(/deadline/i);

    await dateInput.fill('2026-05-01');
    await saveButton.click();

    await vi.waitFor(() => {
      expect(listActions.updateList).toHaveBeenCalledWith(
        mockBoardId,
        mockListId,
        expect.objectContaining({
          [mockDateId]: expect.objectContaining({
            meta: {
              tzOffset: new Date().getTimezoneOffset(),
            },
            value: '2026-05-01',
          }),
        }),
      );
    });
  });
});
