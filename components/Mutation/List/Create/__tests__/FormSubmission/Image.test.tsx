import { getAllElements, renderAddListDialog } from '../testUtils';
import { mockedUseBoardContext, CREATE_LIST_FAIL } from '../testMocks';
import * as listActions from '@/utils/actions/list';
import {
  mockBoardId,
  mockCardId,
  mockImageId,
  mockPublicId,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';

// ───────────────────────────────────────────────────────────
// Mocks
// ───────────────────────────────────────────────────────────

vi.mock('@/utils/actions/list');
vi.mock('@/components/BoardPage/BoardContext', { spy: true });
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

beforeAll(() => {
  mockedUseBoardContext();
  vi.mocked(listActions.createList).mockResolvedValue(CREATE_LIST_FAIL);
});
afterAll(() => {
  vi.resetAllMocks();
});

// ───────────────────────────────────────────────────────────
// Form submission
// ───────────────────────────────────────────────────────────

describe('AddListDialog form submission', () => {
  it('image: calls createList with correct value', async () => {
    await renderAddListDialog();

    const { imageList, saveButton } = getAllElements();

    const imageInput = imageList.getByTestId('mock-image-input');

    // Click the stub — it calls handleFieldChange with ['mock-public-id']
    await imageInput.click();
    await saveButton.click();

    expect(listActions.createList).toHaveBeenCalledWith(
      mockBoardId,
      mockCardId,
      expect.objectContaining({
        [mockImageId]: expect.objectContaining({ value: [mockPublicId] }),
      }),
    );
  });
});
