import { mockedUseBoardContext } from '../testMocks';
import {
  getAllElements,
  openAddListDialog,
  renderAddListDialog,
} from '../testUtils';
import * as listActions from '@/utils/actions/list';
import { toast } from 'react-toastify';

// ───────────────────────────────────────────────────────────
// Mocks
// ───────────────────────────────────────────────────────────

vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');
vi.mock('@/components/BoardPage/BoardContext', { spy: true });

// ───────────────────────────────────────────────────────────
// Setup
// ───────────────────────────────────────────────────────────

beforeAll(() => {
  mockedUseBoardContext();
});
afterAll(() => {
  vi.resetAllMocks();
});

// ───────────────────────────────────────────────────────────
// Form submission
// ───────────────────────────────────────────────────────────

describe('AddListDialog form submission', () => {
  it('blocks empty submission and keeps the dialog open', async () => {
    await renderAddListDialog();
    await openAddListDialog();

    const { header, saveButton } = getAllElements();
    await saveButton.click();

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'At least one field must have a value',
      );
    });
    expect(listActions.createList).not.toHaveBeenCalled();
    expect(header).toBeVisible();
  });
});
