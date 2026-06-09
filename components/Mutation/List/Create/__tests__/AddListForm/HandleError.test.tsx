import {
  mockedUseBoardContext,
  CREATE_LIST_FAIL,
  mockCloseAddList,
} from '../testMocks';
import { getAllElements, renderAddListDialog } from '../testUtils';
import * as listActions from '@/utils/actions/list';
import { toast } from 'react-toastify';

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
  it('shows an error toast and keeps dialog open when createList fails', async () => {
    await renderAddListDialog();

    // Fill out a field and submit form
    const { saveButton, textList } = getAllElements();
    const textInput = textList.getByLabelText(/note/i);
    await textInput.fill('My note');
    await saveButton.click();

    expect(toast.error).toHaveBeenCalledWith('Failed to add list');
    expect(mockCloseAddList).not.toHaveBeenCalled();
  });
});
