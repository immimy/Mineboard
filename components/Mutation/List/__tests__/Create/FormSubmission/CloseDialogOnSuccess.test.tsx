import { mockedUseBoardContext, CREATE_LIST_SUCCESS } from '../testMocks';
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
  vi.mocked(listActions.createList).mockResolvedValue(CREATE_LIST_SUCCESS);
});
afterAll(() => {
  vi.resetAllMocks();
});

// ───────────────────────────────────────────────────────────
// Form submission
// ───────────────────────────────────────────────────────────

describe('AddListDialog form submission', () => {
  it('closes the dialog after successful submission', async () => {
    await renderAddListDialog();
    await openAddListDialog();

    // Fill out a field and submit form
    const { header, saveButton, textList } = getAllElements();
    const textInput = textList.getByLabelText(/note/i);
    await textInput.fill('My note');
    await saveButton.click();

    await vi.waitFor(() => {
      expect(header.query()).toBe(null);
    });
  });
});
