import { mockedUseBoardContext } from '../testMocks';
import { getAllElements, renderAddListDialog } from '../testUtils';

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
  it('number: updates value on type', async () => {
    await renderAddListDialog();

    const { numberList } = getAllElements();
    const numberInput = numberList.getByLabelText(/estimate/i);

    await numberInput.fill('8');
    expect(numberInput).toHaveValue(8);
  });
});
