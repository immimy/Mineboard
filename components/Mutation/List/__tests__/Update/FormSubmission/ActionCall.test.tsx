import {
  mockBoardId,
  mockTextId,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { Field_Type } from '@/gql/__generated__/graphql';
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

describe('UpdateListDialog form submission', () => {
  it('calls updateList with boardId, listId and current form data', async () => {
    renderUpdateListDialog();

    const { saveButton, textInput } = getAllElements();

    await openUpdateListDialog();
    await textInput.fill('Read Clean Code');
    await saveButton.click();

    await vi.waitFor(() => {
      expect(listActions.updateList).toHaveBeenCalledOnce();
      expect(listActions.updateList).toHaveBeenCalledWith(
        mockBoardId,
        mockListId,
        expect.objectContaining({
          [mockTextId]: expect.objectContaining({
            type: Field_Type.Text,
            value: 'Read Clean Code',
          }),
        }),
      );
    });
  });
});
