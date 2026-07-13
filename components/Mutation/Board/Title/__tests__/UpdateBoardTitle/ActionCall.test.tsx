import * as boardActions from '@/utils/actions/board';
import { userEvent } from 'vitest/browser';
import { mockBoardId, UPDATE_BOARD_TITLE_SUCCESS } from './testMocks';
import { getAllElements, renderUpdateBoardTitle } from './testUtils';

vi.mock('@/utils/actions/board');

beforeEach(() => {
  vi.mocked(boardActions.updateBoardTitle).mockResolvedValue(
    UPDATE_BOARD_TITLE_SUCCESS,
  );
});

describe('UpdateBoardTitle form submission', () => {
  it('calls updateBoardTitle with the trimmed board title', async () => {
    await renderUpdateBoardTitle();

    const { titleInput, updateButton, saveButton } = getAllElements();

    await userEvent.click(updateButton());
    await titleInput.fill('  Career roadmap  ');
    await userEvent.click(saveButton);

    await vi.waitFor(() => {
      expect(boardActions.updateBoardTitle).toHaveBeenCalledOnce();
    });

    const formData = vi.mocked(boardActions.updateBoardTitle).mock.calls[0][0];
    expect(formData.get('boardId')).toBe(mockBoardId);
    expect(formData.get('title')).toBe('Career roadmap');
  });

  it('cancels without submitting when the trimmed title did not change', async () => {
    await renderUpdateBoardTitle();

    const { titleInput, updateButton, saveButton } = getAllElements();

    await userEvent.click(updateButton());
    await titleInput.fill('  Test Board  ');
    await userEvent.click(saveButton);

    await expect.element(titleInput).toHaveValue('Test Board');
    await expect.element(titleInput).toBeDisabled();
    expect(boardActions.updateBoardTitle).not.toHaveBeenCalled();
  });
});
