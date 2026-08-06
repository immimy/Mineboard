import { MockedProvider } from '@apollo/client/testing/react';
import * as cardActions from '@/utils/actions/card';
import { toast } from 'react-toastify';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import BoardContextProvider from '../BoardContext';
import CardDeletions from '../CardDeletions';
import CardDeletionsProvider, {
  useCardDeletionsContext,
} from '../CardDeletionsContext';
import { mockBoardId } from './singleBoardQuery.mock';
import {
  createCardDeletionsCache,
  deleteActionSuccess,
  deleteCardsError,
  mockSelectedCardIds,
  readCachedCards,
} from './testMocks';

function CardDeletionHarness() {
  const { isDeleteMode, setDeleteMode, updateDeletedCards } =
    useCardDeletionsContext();

  return (
    <>
      <button type='button' onClick={() => setDeleteMode(true)}>
        Start deleting
      </button>
      <button
        type='button'
        onClick={() => updateDeletedCards(mockSelectedCardIds[0])}
      >
        Select first card
      </button>
      <button
        type='button'
        onClick={() => updateDeletedCards(mockSelectedCardIds[1])}
      >
        Select second card
      </button>
      {isDeleteMode && <CardDeletions />}
    </>
  );
}

const renderCardDeletions = (cache = createCardDeletionsCache()) => {
  render(
    <MockedProvider cache={cache}>
      <BoardContextProvider boardId={mockBoardId}>
        <CardDeletionsProvider>
          <CardDeletionHarness />
        </CardDeletionsProvider>
      </BoardContextProvider>
    </MockedProvider>,
  );
  return cache;
};

const getAllElements = () => {
  return {
    startDeletingBtn: page.getByRole('button', { name: /start deleting/i }),
    cancelBtn: page.getByRole('button', { name: /cancel/i }),
    deleteBtn: page.getByRole('button', { name: /delete cards/i }),
    confirmBtn: page.getByRole('button', { name: /continue/i }),
    selectFirstCardBtn: page.getByRole('button', {
      name: /select first card/i,
    }),
    selectSecondCardBtn: page.getByRole('button', {
      name: /select second card/i,
    }),
  };
};

const startDeleting = async () => {
  const { startDeletingBtn } = getAllElements();
  await startDeletingBtn.click();
};

/** Test cases */

describe('Multiple card deletions', () => {
  it('disables deletion without selections and resets selections on cancel', async () => {
    renderCardDeletions();
    await startDeleting();

    const { deleteBtn, cancelBtn, selectFirstCardBtn } = getAllElements();

    // Deletion is available only while at least one card is selected.
    await expect.element(deleteBtn).toBeDisabled();
    await selectFirstCardBtn.click();
    await expect.element(deleteBtn).toBeEnabled();

    await deleteBtn.click();
    await cancelBtn.last().click();

    // Cancelling the confirmation also clears the previous selection.
    await startDeleting();
    await expect.element(deleteBtn).toBeDisabled();
  });

  it('deletes all selected cards in one action and removes them from cache', async () => {
    vi.mocked(cardActions.deleteCards).mockResolvedValue(deleteActionSuccess);
    const cache = renderCardDeletions();

    const { selectFirstCardBtn, selectSecondCardBtn, deleteBtn, confirmBtn } =
      getAllElements();

    await startDeleting();

    await selectFirstCardBtn.click();
    await selectSecondCardBtn.click();
    await deleteBtn.click();
    await confirmBtn.click();

    // One action receives the complete selection instead of deleting one by one.
    await vi.waitFor(() => {
      expect(cardActions.deleteCards).toHaveBeenCalledWith(
        mockBoardId,
        mockSelectedCardIds,
      );
    });

    // Success exits delete mode and removes every selected cache edge.
    await expect.element(deleteBtn).not.toBeInTheDocument();
    expect(readCachedCards(cache)?.edges).toHaveLength(0);
  });

  it('retains selections and deletion mode after a failed action', async () => {
    vi.mocked(cardActions.deleteCards).mockResolvedValue(deleteCardsError);
    renderCardDeletions();

    const { selectFirstCardBtn, deleteBtn, confirmBtn } = getAllElements();

    await startDeleting();

    await selectFirstCardBtn.click();
    await deleteBtn.click();
    await confirmBtn.click();

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(deleteCardsError.error);
    });

    // Failure preserves delete mode and the selection so the user can retry.
    await expect
      .element(page.getByText(/deletion includes multiple cards/i))
      .toBeVisible();
    await expect
      .element(
        page
          .getByRole('button', {
            name: /delete cards/i,
            includeHidden: true,
          })
          .first(),
      )
      .toBeEnabled();
  });
});
