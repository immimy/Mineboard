import {
  getAllElements,
  renderListFieldDialog,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import {
  existingTextDateListFields,
  UPDATE_LIST_FIELDS_FAIL,
} from './testMocks';
import * as boardActions from '@/utils/actions/board';
import { toast } from 'react-toastify';
import { page } from 'vitest/browser';
import { mockUpdateListFieldsFailure } from './testUtils';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

type RenderListFieldDialogOptions = NonNullable<
  Parameters<typeof renderListFieldDialog>[0]
>;

beforeEach(() => {
  mockUpdateListFieldsFailure();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('Update List field dialog — update submit errors', () => {
  it('keeps the dialog mounted and shows a toast when updating list fields fails', async () => {
    await renderListFieldDialog({
      queryListFields:
        existingTextDateListFields as RenderListFieldDialogOptions['queryListFields'],
    });

    const { dialog, openDialogButton, saveButton, titleInput } =
      getAllElements();
    const formIntro = page.getByText(/personalize the list item/i);

    await openDialogButton.click();
    await titleInput.text.fill('Edited note');
    await saveButton.click();

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(UPDATE_LIST_FIELDS_FAIL.error);
    });
    expect(boardActions.createListFields).not.toHaveBeenCalled();
    await expect.element(dialog).toBeVisible();
    await expect.element(formIntro).toBeVisible();
  });
});
