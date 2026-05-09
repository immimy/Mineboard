import { mockCardId } from '@/components/Board/__tests__/singleBoardQuery.mock';
import { mockedUseBoardContext, CREATE_LIST_SUCCESS } from '../testMocks';
import { getAllElements, renderAddListDialog } from '../testUtils';
import * as listActions from '@/utils/actions/list';
import { InMemoryCache } from '@apollo/client-integration-nextjs';

// ───────────────────────────────────────────────────────────
// Mocks
// ───────────────────────────────────────────────────────────

vi.mock('@/utils/actions/list');
vi.mock('@/components/Board/BoardContext', { spy: true });
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

// ───────────────────────────────────────────────────────────
// Setup
// ───────────────────────────────────────────────────────────

beforeAll(() => {
  mockedUseBoardContext();
  vi.mocked(listActions.createList).mockResolvedValue(CREATE_LIST_SUCCESS);
});
afterAll(() => {
  vi.resetAllMocks();
});

// ───────────────────────────────────────────────────────────
// Form submission
// ───────────────────────────────────────────────────────────

describe('AddListDialog form submission', () => {
  it('update new list to Apollo cache after successful submission', async () => {
    const mockCache = vi.mockObject(new InMemoryCache(), { spy: true });
    await renderAddListDialog(mockCache);

    const { saveButton } = getAllElements();
    await saveButton.click();

    // Expected new created list
    const newCreatedList =
      CREATE_LIST_SUCCESS.data.listsCollection?.edges[0].node;
    // Writes the new list to Apollo cache
    expect(mockCache.writeFragment).toHaveBeenCalledWith(
      expect.objectContaining({
        fragmentName: 'createdList',
        data: newCreatedList,
      }),
    );
    // Adds the new list to the card collection in Apollo cache
    expect(mockCache.modify).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.stringContaining(mockCardId),
        fields: expect.objectContaining({
          listsCollection: expect.any(Function),
        }),
      }),
    );
  });
});
