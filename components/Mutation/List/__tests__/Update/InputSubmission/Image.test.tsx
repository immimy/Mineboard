import {
  mockBoardId,
  mockImageId,
  mockPublicId,
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
  it('image: calls updateList with correct value', async () => {
    renderUpdateListDialog();
    await openUpdateListDialog();

    const { imageList, saveButton } = getAllElements();
    const imageInput = imageList.getByTestId('mock-image-input');

    await imageInput.click();
    await saveButton.click();

    await vi.waitFor(() => {
      expect(listActions.updateList).toHaveBeenCalledWith(
        mockBoardId,
        mockListId,
        expect.objectContaining({
          [mockImageId]: expect.objectContaining({ value: [mockPublicId] }),
        }),
      );
    });
  });
});
