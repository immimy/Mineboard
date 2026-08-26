import { toast } from 'react-toastify';
import * as listActions from '@/utils/actions/list';
import { page, userEvent } from 'vitest/browser';
import { mockCardId, mockListId, successMock } from './singleBoardQuery.mock';
import { deleteActionSuccess, deleteListError } from './testMocks';
import { renderBoard } from './testUtils';

vi.mock('@/components/Mutation/List/ListInputs/ImageInput');
vi.mock('@/components/Mutation/Board/ListField/ListFieldDialog', () => ({
  default: () => <div data-testid='mock-list-field-dialog' />,
}));

const getAllElements = () => ({
  listValue: page
    .getByRole('article', { includeHidden: true })
    .getByText('Start with Atomic Habits', { exact: true }),
  updateButton: page.getByRole('button', {
    name: /update list 1 of test card/i,
  }),
  dialog: page.getByRole('dialog', { name: /update list/i }),
  deleteButton: page.getByRole('button', { name: /delete list/i }),
});

describe('Delete list feature', () => {
  it('deletes the selected list, updates its card, and closes the dialog', async () => {
    vi.mocked(listActions.deleteList).mockResolvedValue(deleteActionSuccess);
    renderBoard([successMock]);

    const { listValue, updateButton, dialog, deleteButton } = getAllElements();

    await expect.element(listValue).toBeVisible();
    await userEvent.click(updateButton);
    await userEvent.click(deleteButton);

    // The action receives both the parent card and selected list IDs.
    await vi.waitFor(() => {
      expect(listActions.deleteList).toHaveBeenCalledWith(
        mockCardId,
        mockListId,
      );
    });

    // Success removes the list and closes its dialog.
    await expect.element(listValue).not.toBeInTheDocument();
    await expect.element(dialog).not.toBeInTheDocument();
  });

  it('keeps the list and dialog open when deletion fails', async () => {
    vi.mocked(listActions.deleteList).mockResolvedValue(deleteListError);
    renderBoard([successMock]);

    const { listValue, updateButton, dialog, deleteButton } = getAllElements();

    await userEvent.click(updateButton);
    await userEvent.click(deleteButton);

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(deleteListError.error);
    });

    // Failure preserves both the list and its open dialog.
    await expect.element(listValue).toBeVisible();
    await expect.element(dialog).toBeVisible();
  });
});
