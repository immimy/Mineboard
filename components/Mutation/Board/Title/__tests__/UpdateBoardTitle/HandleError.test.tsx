import * as boardActions from '@/utils/actions/board';
import { toast } from 'react-toastify';
import { userEvent } from 'vitest/browser';
import { UPDATE_BOARD_TITLE_FAIL } from './testMocks';
import { getAllElements, renderUpdateBoardTitle } from './testUtils';

vi.mock('@/utils/actions/board');

afterEach(() => {
  vi.mocked(boardActions.updateBoardTitle).mockReset();
});

describe('UpdateBoardTitle form submission', () => {
  it('shows an error toast and keeps edit mode when updateBoardTitle returns an error', async () => {
    vi.mocked(boardActions.updateBoardTitle).mockResolvedValue(
      UPDATE_BOARD_TITLE_FAIL,
    );

    await renderUpdateBoardTitle();

    const { titleInput, updateButton, saveButton } = getAllElements();

    await userEvent.click(updateButton());
    await titleInput.fill('Career roadmap');
    await userEvent.click(saveButton);

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update board title');
    });

    await expect.element(titleInput).toBeEnabled();
    await expect.element(titleInput).toHaveValue('Career roadmap');
  });

  it('shows a generic error toast when updateBoardTitle throws', async () => {
    vi.mocked(boardActions.updateBoardTitle).mockRejectedValue(
      new Error('Boom'),
    );

    await renderUpdateBoardTitle();

    const { titleInput, updateButton, saveButton } = getAllElements();

    await userEvent.click(updateButton());
    await titleInput.fill('Career roadmap');
    await userEvent.click(saveButton);

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update board title');
    });
  });
});
