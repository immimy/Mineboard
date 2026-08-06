import { toast } from 'react-toastify';
import * as cardActions from '@/utils/actions/card';
import { page, userEvent } from 'vitest/browser';
import { mockBoardId, mockCardId, successMock } from './singleBoardQuery.mock';
import { deleteActionSuccess, deleteCardError } from './testMocks';
import { renderBoard } from './testUtils';

vi.mock('@/components/Mutation/List/ListInputs/ImageInput');
vi.mock('@/components/Mutation/Board/ListField/ListFieldDialog', () => ({
  default: () => <div data-testid='mock-list-field-dialog' />,
}));

const getAllElements = () => ({
  card: page
    .getByRole('article', { includeHidden: true })
    .filter({ hasText: /test card/i }),
  updateButton: page.getByRole('button', { name: /update test card/i }),
  dialog: page.getByRole('dialog', { name: /update card/i }),
  deleteButton: page.getByRole('button', { name: /delete card/i }),
});

describe('Delete card feature', () => {
  it('deletes the selected card, updates the board, and closes the dialog', async () => {
    vi.mocked(cardActions.deleteCards).mockResolvedValue(deleteActionSuccess);
    renderBoard([successMock]);

    const { card, updateButton, dialog, deleteButton } = getAllElements();

    await expect.element(card).toBeVisible();
    await userEvent.click(updateButton);
    await userEvent.click(deleteButton);

    // The action targets only the card selected from the update dialog.
    await vi.waitFor(() => {
      expect(cardActions.deleteCards).toHaveBeenCalledWith(mockBoardId, [
        mockCardId,
      ]);
    });

    // Success removes the card and closes its dialog.
    await expect.element(card).not.toBeInTheDocument();
    await expect.element(dialog).not.toBeInTheDocument();
  });

  it('keeps the card and dialog open when deletion fails', async () => {
    vi.mocked(cardActions.deleteCards).mockResolvedValue(deleteCardError);
    renderBoard([successMock]);

    const { card, updateButton, dialog, deleteButton } = getAllElements();

    await userEvent.click(updateButton);
    await userEvent.click(deleteButton);

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(deleteCardError.error);
    });

    // Failure leaves both the card and its dialog unchanged.
    await expect.element(card).toBeVisible();
    await expect.element(dialog).toBeVisible();
  });
});
