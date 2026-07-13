import * as boardActions from '@/utils/actions/board';
import { toast } from 'react-toastify';
import {
  CREATE_BOARD_EMPTY_EDGE,
  CREATE_BOARD_FAIL,
  CREATE_BOARD_SUCCESS,
} from './testMocks';
import { getAllElements, renderAddBoardTitle } from './testUtils';

vi.mock('@/utils/actions/board');

afterEach(() => {
  vi.mocked(boardActions.createBoard).mockReset();
});

describe('AddBoardActionButton form submission', () => {
  it('shows an error toast when createBoard returns an error', async () => {
    vi.mocked(boardActions.createBoard).mockResolvedValue(CREATE_BOARD_FAIL);

    await renderAddBoardTitle();

    const { createBoardButton, titleInput } = getAllElements();

    await createBoardButton.click();
    await titleInput.fill('Error board');
    await createBoardButton.click();

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to add board');
    });
  });

  it('shows an error toast when the created board is missing from the response', async () => {
    vi.mocked(boardActions.createBoard).mockResolvedValue(
      CREATE_BOARD_EMPTY_EDGE,
    );

    await renderAddBoardTitle();

    const { createBoardButton, titleInput } = getAllElements();

    await createBoardButton.click();
    await titleInput.fill('Missing board');
    await createBoardButton.click();

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to fetch new board, please refresh',
      );
    });
  });

  it('shows a generic error toast when createBoard throws', async () => {
    vi.mocked(boardActions.createBoard).mockRejectedValue(new Error('Boom'));

    await renderAddBoardTitle();

    const { createBoardButton, titleInput } = getAllElements();

    await createBoardButton.click();
    await titleInput.fill('Thrown board');
    await createBoardButton.click();

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create board');
    });
  });

  it('removes the pending board after the action settles', async () => {
    let resolveCreateBoard!: (value: typeof CREATE_BOARD_SUCCESS) => void;

    vi.mocked(boardActions.createBoard).mockReturnValue(
      new Promise((resolve) => {
        resolveCreateBoard = resolve;
      }),
    );

    await renderAddBoardTitle();

    const { createBoardButton, titleInput, pendingBoard } = getAllElements();

    await createBoardButton.click();
    await titleInput.fill('Pending board');
    await createBoardButton.click();

    await expect.element(pendingBoard('Pending board')).toBeVisible();

    resolveCreateBoard(CREATE_BOARD_SUCCESS);

    await expect.element(pendingBoard('Pending board')).not.toBeInTheDocument();
  });
});
