import { InMemoryCache } from '@apollo/client';
import * as boardActions from '@/utils/actions/board';
import {
  ALL_BOARDS_QUERY_DATA,
  ALL_BOARDS_WITH_CREATED_BOARD_DATA,
  CREATE_BOARD_SUCCESS,
  allBoardsQueryOptions,
  mockCreatedBoardId,
} from './testMocks';
import { getAllElements, renderAddBoardTitle } from './testUtils';

vi.mock('@/utils/actions/board');

beforeAll(() => {
  vi.mocked(boardActions.createBoard).mockResolvedValue(CREATE_BOARD_SUCCESS);
});

afterAll(() => {
  vi.resetAllMocks();
});

describe('AddBoardActionButton form submission', () => {
  it('adds the created board to the front of the Apollo cache', async () => {
    const cache = new InMemoryCache();
    cache.writeQuery({
      ...allBoardsQueryOptions,
      data: ALL_BOARDS_QUERY_DATA,
    });

    await renderAddBoardTitle({ cache });

    const { createBoardButton, titleInput } = getAllElements();

    await createBoardButton.click();
    await titleInput.fill('Career roadmap');
    await createBoardButton.click();

    await vi.waitFor(() => {
      const updatedData = cache.readQuery(allBoardsQueryOptions);
      const boardIds =
        updatedData?.boardsCollection?.edges.map((edge) => edge.node.id) ?? [];

      expect(boardIds).toEqual([mockCreatedBoardId, 'boardId1']);
    });
  });

  it('does not add a duplicate board when the cache already has it', async () => {
    const cache = new InMemoryCache();
    cache.writeQuery({
      ...allBoardsQueryOptions,
      data: ALL_BOARDS_WITH_CREATED_BOARD_DATA,
    });

    await renderAddBoardTitle({ cache });

    const { createBoardButton, titleInput } = getAllElements();

    await createBoardButton.click();
    await titleInput.fill('Career roadmap');
    await createBoardButton.click();

    await vi.waitFor(() => {
      const updatedData = cache.readQuery(allBoardsQueryOptions);
      const boardIds =
        updatedData?.boardsCollection?.edges.map((edge) => edge.node.id) ?? [];

      expect(boardIds.filter((id) => id === mockCreatedBoardId)).toHaveLength(
        1,
      );
    });
  });
});
