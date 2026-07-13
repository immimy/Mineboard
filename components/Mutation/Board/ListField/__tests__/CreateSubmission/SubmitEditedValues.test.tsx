import { mockBoardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import {
  getAllElements,
  renderListFieldForm,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { Field_Type } from '@/gql/__generated__/graphql';
import * as boardActions from '@/utils/actions/board';
import { page } from 'vitest/browser';
import { CREATE_LIST_FIELDS_FAIL } from './testMocks';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(boardActions.createListFields).mockResolvedValue(
    CREATE_LIST_FIELDS_FAIL,
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('Add List field — form edited submit values', () => {
  it('submits updated values after field type changes and removal', async () => {
    await renderListFieldForm();

    const { addFieldButton, fieldActionButton, saveButton, titleInput } =
      getAllElements();
    const imageFieldTypeMenuItem = page.getByRole('menuitem', {
      name: /^image$/i,
    });

    // Add text and date field
    await addFieldButton.text.click();
    await titleInput.text.fill('Note');

    await addFieldButton.date.click();
    await titleInput.date.fill('Deadline');

    // Change text to image field
    await fieldActionButton.text.changeType.click();
    await imageFieldTypeMenuItem.click();
    await titleInput.image.fill('Cover');

    // Remove date field
    await fieldActionButton.date.remove.click();

    await saveButton.click();

    // create action should be called once
    await vi.waitFor(() => {
      expect(boardActions.createListFields).toHaveBeenCalledTimes(1);
    });

    const [boardId, submittedFields] = vi.mocked(boardActions.createListFields)
      .mock.calls[0];

    // board id and image field should be passed as an argument correctly
    expect(boardId).toBe(mockBoardId);
    expect(submittedFields).toEqual([
      expect.objectContaining({
        type: Field_Type.Image,
        config: { title: 'Cover' },
      }),
    ]);

    // date field that has been removed should not exist
    expect(submittedFields).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: Field_Type.Date,
          config: { title: 'Deadline' },
        }),
      ]),
    );

    // text field that has been changed should not exist
    expect(submittedFields).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: Field_Type.Text,
          config: { title: 'Note' },
        }),
      ]),
    );
  });
});
