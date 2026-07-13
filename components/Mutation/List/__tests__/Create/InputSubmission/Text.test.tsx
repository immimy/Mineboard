import {
  mockBoardId,
  mockCardId,
  mockTextId,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { mockedUseBoardContext, CREATE_LIST_FAIL } from '../testMocks';
import {
  getAllElements,
  openAddListDialog,
  renderAddListDialog,
} from '../testUtils';
import * as listActions from '@/utils/actions/list';

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
  it('text: calls createList with correct value', async () => {
    await renderAddListDialog();
    await openAddListDialog();

    const { textList, saveButton } = getAllElements();
    const textInput = textList.getByLabelText(/note/i);

    await textInput.fill("Thank god, it' Friday");
    await saveButton.click();

    await vi.waitFor(() => {
      expect(listActions.createList).toHaveBeenCalledWith(
        mockBoardId,
        mockCardId,
        expect.objectContaining({
          [mockTextId]: expect.objectContaining({
            value: "Thank god, it' Friday",
          }),
        }),
      );
    });
  });
});
