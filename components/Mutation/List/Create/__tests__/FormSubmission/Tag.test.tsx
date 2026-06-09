import {
  mockBoardId,
  mockCardId,
  mockTagId,
} from '@/components/Board/__tests__/singleBoardQuery.mock';
import { mockedUseBoardContext, CREATE_LIST_FAIL } from '../testMocks';
import { getAllElements, renderAddListDialog } from '../testUtils';
import * as listActions from '@/utils/actions/list';
import { page, userEvent } from 'vitest/browser';

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
  vi.mocked(listActions.createList).mockResolvedValue(CREATE_LIST_FAIL);
});
afterAll(() => {
  vi.resetAllMocks();
});

// ───────────────────────────────────────────────────────────
// Form submission
// ───────────────────────────────────────────────────────────

describe('AddListDialog form submission', () => {
  it('tag: calls createList with correct value', async () => {
    await renderAddListDialog();

    const { tagList, saveButton } = getAllElements();
    const tagInput = tagList.getByPlaceholder(/add tag/i);

    // Fill out tag
    await tagInput.fill('shopping');
    await userEvent.keyboard('{Enter}');
    // Pick color
    const newTag = tagList.getByText('shopping');
    await newTag.click();
    const pickColor2 = page.getByLabelText('Set tag color 2');
    await pickColor2.click();
    // Submit form
    await saveButton.click();

    expect(listActions.createList).toHaveBeenCalledWith(
      mockBoardId,
      mockCardId,
      expect.objectContaining({
        [mockTagId]: expect.objectContaining({
          value: [{ tag: 'shopping', color: 2 }],
        }),
      }),
    );
  });
});
