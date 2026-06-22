import { mockBoardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import {
  CREATE_LIST_FIELDS_FAIL,
  getAllElements,
  renderAddListFieldsForm,
} from '@/components/Mutation/Board/Create/__tests__/AddListFieldsForm/testUtils';
import { Field_Type } from '@/gql/__generated__/graphql';
import * as boardActions from '@/utils/actions/board';
import { page } from 'vitest/browser';

vi.mock('@/utils/actions/board', () => ({ createListFields: vi.fn() }));

beforeEach(() => {
  vi.mocked(boardActions.createListFields).mockResolvedValue(
    CREATE_LIST_FIELDS_FAIL,
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('Add list fields edited submit values', () => {
  it('submits updated values after field type changes and removal', async () => {
    await renderAddListFieldsForm();

    const { addFieldButton, fieldActionButton, saveButton, titleInput } =
      getAllElements();
    const imageFieldTypeMenuItem = page.getByRole('menuitem', {
      name: /^image$/i,
    });

    await addFieldButton.text.click();
    await titleInput.text.fill('Note');

    await addFieldButton.date.click();
    await titleInput.date.fill('Deadline');

    await fieldActionButton.text.changeType.click();
    await imageFieldTypeMenuItem.click();
    await titleInput.image.fill('Cover');

    await fieldActionButton.date.remove.click();
    await saveButton.click();

    await vi.waitFor(() => {
      expect(boardActions.createListFields).toHaveBeenCalledWith(mockBoardId, [
        expect.objectContaining({
          type: Field_Type.Image,
          config: { title: 'Cover' },
        }),
      ]);
    });
  });
});
