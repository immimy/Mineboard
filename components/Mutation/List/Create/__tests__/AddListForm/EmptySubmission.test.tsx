import { mockedUseBoardContext } from '../testMocks';
import { getAllElements, renderAddListDialog } from '../testUtils';
import * as listActions from '@/utils/actions/list';
import { toast } from 'react-toastify';

// ───────────────────────────────────────────────────────────
// Mocks
// ───────────────────────────────────────────────────────────

vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');
vi.mock('@/components/Board/BoardContext', { spy: true });

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

    const { header, saveButton } = getAllElements();
    await saveButton.click();

    expect(toast.error).toHaveBeenCalledWith(
      'At least one field must have a value',
    );
    expect(listActions.createList).not.toHaveBeenCalled();
    expect(header).toBeVisible();
  });
});
