import {
  mockBoardId,
  mockCardId,
  mockDateId,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { mockedUseBoardContext, CREATE_LIST_FAIL } from '../testMocks';
import {
  getAllElements,
  openAddListDialog,
  renderAddListDialog,
} from '../testUtils';
import * as listActions from '@/utils/actions/list';
import { userEvent } from 'vitest/browser';

// ───────────────────────────────────────────────────────────
// Mocks
// ───────────────────────────────────────────────────────────

vi.mock('@/utils/actions/list');
vi.mock('@/components/BoardPage/BoardContext', { spy: true });
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
  it('date: calls createList with correct value', async () => {
    await renderAddListDialog();
    await openAddListDialog();

    const { dateList, saveButton } = getAllElements();
    const dateInput = dateList.getByLabelText(/deadline/i);

    await userEvent.type(dateInput, '05012026');
    await saveButton.click();

    await vi.waitFor(() => {
      expect(listActions.createList).toHaveBeenCalledWith(
        mockBoardId,
        mockCardId,
        expect.objectContaining({
          [mockDateId]: expect.objectContaining({
            meta: {
              tzOffset: new Date().getTimezoneOffset(),
            },
            value: '2026-05-01',
          }),
        }),
      );
    });
  });
});
