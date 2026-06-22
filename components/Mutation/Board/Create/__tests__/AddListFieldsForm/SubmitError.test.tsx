import {
  CREATE_LIST_FIELDS_FAIL,
  getAllElements,
  renderAddListFieldsForm,
} from '@/components/Mutation/Board/Create/__tests__/AddListFieldsForm/testUtils';
import * as boardActions from '@/utils/actions/board';
import { toast } from 'react-toastify';
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

describe('Add list fields submit errors', () => {
  it('keeps the form mounted and shows a toast when saving list fields fails', async () => {
    await renderAddListFieldsForm();

    const { addFieldButton, saveButton, titleInput } = getAllElements();
    const formIntro = page.getByText(/personalize the list item/i);

    await addFieldButton.text.click();
    await titleInput.text.fill('Note');
    await saveButton.click();

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create list fields');
    });
    await expect.element(formIntro).toBeVisible();
  });
});
