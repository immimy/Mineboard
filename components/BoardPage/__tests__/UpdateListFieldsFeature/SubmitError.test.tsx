import * as boardActions from '@/utils/actions/board';
import { toast } from 'react-toastify';
import { page, userEvent } from 'vitest/browser';
import { UPDATE_LIST_FIELDS_FAIL } from './testMocks';
import {
  getAllElements,
  openListFieldsFromActionMenu,
  renderBoard,
  saveTextFieldTitle,
} from './testUtils';

vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

beforeEach(() => {
  vi.mocked(boardActions.updateListFields).mockResolvedValue(
    UPDATE_LIST_FIELDS_FAIL,
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('Update list fields submit error', () => {
  it('keeps the existing board fields when updating list fields fails', async () => {
    await renderBoard();

    const {
      addListButton,
      closeListFieldsDialogButton,
      closeUnsavedAlertButton,
      listFieldsFormIntro,
    } = getAllElements();

    await openListFieldsFromActionMenu();
    await saveTextFieldTitle('Summary');

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(UPDATE_LIST_FIELDS_FAIL.error);
    });
    await expect.element(listFieldsFormIntro).toBeVisible();

    await userEvent.click(closeListFieldsDialogButton);
    await userEvent.click(closeUnsavedAlertButton);

    await userEvent.click(addListButton);

    await expect.element(page.getByLabelText(/^note$/i)).toBeVisible();
    await expect
      .element(page.getByLabelText('Summary'))
      .not.toBeInTheDocument();
  });
});
