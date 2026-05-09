import {
  mockBoardId,
  mockCardId,
  mockCheckboxId,
  mockTagId,
} from '@/components/Board/__tests__/singleBoardQuery.mock';
import { mockedUseBoardContext, CREATE_LIST_FAIL } from '../testMocks';
import { getAllElements, renderAddListDialog } from '../testUtils';
import * as listActions from '@/utils/actions/list';
import { userEvent } from 'vitest/browser';

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
  it('calls createList with boardId, cardId and current form data', async () => {
    await renderAddListDialog();

    const { tagList, checkboxList, saveButton } = getAllElements();
    const titleInput = checkboxList.getByPlaceholder('checklist');
    const tagInput = tagList.getByPlaceholder(/add tag/i);

    // Fill out tag
    await tagInput.fill('routine');
    await userEvent.keyboard('{Enter}');
    // Fill out checkbox
    await titleInput.fill('write daily journal');
    // Submit form
    await saveButton.click();

    expect(listActions.createList).toHaveBeenCalledWith(
      mockBoardId,
      mockCardId,
      expect.objectContaining({
        [mockTagId]: { value: [{ tag: 'routine' }] },
        [mockCheckboxId]: {
          value: { checked: false, title: 'write daily journal' },
        },
      }),
    );
  });
});
