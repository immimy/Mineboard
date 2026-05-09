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
  it('text: updates textarea value on type', async () => {
    await renderAddListDialog();

    const { textList } = getAllElements();
    const textInput = textList.getByLabelText(/note/i);

    await textInput.fill('My note');
    expect(textInput).toHaveValue('My note');
  });
});
