import { InMemoryCache } from '@apollo/client';
import * as boardActions from '@/utils/actions/board';
import {
  boardTitleFragment,
  mockBoardId,
  mockBoardTitle,
  mockUpdatedBoardTitle,
  UPDATE_BOARD_TITLE_SUCCESS,
} from './testMocks';
import { getAllElements, renderUpdateBoardTitle } from './testUtils';

vi.mock('@/utils/actions/board');

beforeEach(() => {
  vi.mocked(boardActions.updateBoardTitle).mockResolvedValue(
    UPDATE_BOARD_TITLE_SUCCESS,
  );
});

describe('UpdateBoardTitle cache update', () => {
  it('updates the normalized board title in the Apollo cache', async () => {
    const cache = new InMemoryCache();
    const boardCacheId = cache.identify({
      __typename: 'boards',
      id: mockBoardId,
    });

    cache.writeFragment({
      id: boardCacheId,
      fragment: boardTitleFragment,
      data: {
        __typename: 'boards',
        id: mockBoardId,
        title: mockBoardTitle,
      },
    });

    await renderUpdateBoardTitle({ cache });

    const { titleInput, updateButton, saveButton } = getAllElements();

    await updateButton().click();
    await titleInput.fill(mockUpdatedBoardTitle);
    await saveButton.click();

    await vi.waitFor(() => {
      const updatedBoard = cache.readFragment<{
        title: string;
      }>({
        id: boardCacheId,
        fragment: boardTitleFragment,
      });

      expect(updatedBoard?.title).toBe(mockUpdatedBoardTitle);
    });
  });
});
