import {
  mockBoardId,
  mockTagId,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import * as listActions from '@/utils/actions/list';
import { page, userEvent } from 'vitest/browser';
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
  it('tag: calls updateList with correct value', async () => {
    renderUpdateListDialog();
    await openUpdateListDialog();

    const { tagList, saveButton } = getAllElements();
    const tagInput = tagList.getByPlaceholder(/add tag/i);

    await tagInput.fill('shopping');
    await userEvent.keyboard('{Enter}');
    const newTag = tagList.getByText('shopping');
    await newTag.click();
    const pickColor2 = page.getByLabelText('Set tag color 2');
    await pickColor2.click();
    await saveButton.click();

    await vi.waitFor(() => {
      expect(listActions.updateList).toHaveBeenCalledWith(
        mockBoardId,
        mockListId,
        expect.objectContaining({
          [mockTagId]: expect.objectContaining({
            value: [{ tag: 'shopping', color: 2 }],
          }),
        }),
      );
    });
  });
});
