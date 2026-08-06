import type { AllBoardsQuery } from '@/gql/__generated__/graphql';
import { AllBoardsQuery as AllBoardsQueryDocument } from '@/gql/queries';
import { mockReplace } from '@/mocks/browser/next/navigation';
import * as boardActions from '@/utils/actions/board';
import { toast } from 'react-toastify';
import { page, userEvent } from 'vitest/browser';
import { mockBoardId } from '../singleBoardQuery.mock';
import {
  allBoardsQueryConfig,
  createDeleteBoardCache,
  mockRemainingBoardId,
  mockUserId,
} from './testMocks';
import { getAllElements, openActionMenu, renderActionMenu } from './testUtils';

describe('ActionMenu — Delete board action', () => {
  it('cancels without deleting the board', async () => {
    await renderActionMenu();

    const { deleteBoardButton, cancelButton } = getAllElements();

    await openActionMenu();
    await userEvent.click(deleteBoardButton);
    await userEvent.click(cancelButton);

    expect(boardActions.deleteBoard).not.toHaveBeenCalled();
    await expect
      .element(page.getByText(/this board will be permanently deleted/i))
      .not.toBeInTheDocument();
  });

  it('shows pending controls, updates the cache, and redirects on success', async () => {
    let resolveDelete: ((value: { error: null }) => void) | undefined;
    vi.mocked(boardActions.deleteBoard).mockReturnValue(
      new Promise((resolve) => {
        resolveDelete = resolve;
      }),
    );
    const cache = createDeleteBoardCache();
    await renderActionMenu(undefined, { cache, userId: mockUserId });

    const { deleteBoardButton, cancelButton, confirmButton } = getAllElements();

    await openActionMenu();
    await userEvent.click(deleteBoardButton);
    await userEvent.click(confirmButton);

    // The unresolved action keeps every dialog control disabled.
    await expect.element(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    resolveDelete?.({ error: null });

    // A successful deletion leaves the deleted board route.
    await vi.waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });

    const cachedBoards = cache.readQuery<AllBoardsQuery>({
      query: AllBoardsQueryDocument,
      variables: allBoardsQueryConfig.variables,
    });

    // The dashboard cache retains only the board that was not deleted.
    expect(
      cachedBoards?.boardsCollection?.edges.map(({ node }) => node.id),
    ).toEqual([mockRemainingBoardId]);

    // No SingleBoard root field remains for the deleted board.
    expect(
      Object.keys(cache.extract().ROOT_QUERY ?? {}).filter((field) =>
        field.includes(mockBoardId),
      ),
    ).toEqual([]);
  });

  it('keeps the confirmation open and reports recoverable errors', async () => {
    vi.mocked(boardActions.deleteBoard).mockResolvedValue({
      data: null,
      error: 'Failed to delete board',
    });
    await renderActionMenu(undefined, { userId: mockUserId });

    const { deleteBoardButton, confirmButton } = getAllElements();

    await openActionMenu();
    await userEvent.click(deleteBoardButton);
    await userEvent.click(confirmButton);

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete board');
    });

    // Recoverable errors keep the dialog open and prevent navigation.
    await expect
      .element(page.getByText(/this board will be permanently deleted/i))
      .toBeVisible();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
