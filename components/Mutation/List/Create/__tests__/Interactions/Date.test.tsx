import { userEvent } from 'vitest/browser';
import { getAllElements, renderAddListDialog } from '../testUtils';
import { mockedUseBoardContext } from '../testMocks';

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
});
afterAll(() => {
  vi.resetAllMocks();
});

// ───────────────────────────────────────────────────────────
// Interaction
// ───────────────────────────────────────────────────────────

describe('AddListDialog interaction', () => {
  it('date: updates value on type', async () => {
    await renderAddListDialog();

    const { dateList } = getAllElements();
    const dateInput = dateList.getByLabelText(/deadline/i);

    await userEvent.type(dateInput, '05012026');
    expect(dateInput).toHaveValue('2026-05-01');
  });
});
