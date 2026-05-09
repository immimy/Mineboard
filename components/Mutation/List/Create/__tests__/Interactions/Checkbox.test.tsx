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
  it('checkbox: toggles the checked state on click', async () => {
    await renderAddListDialog();

    const { checkboxList } = getAllElements();
    const checkedInput = checkboxList.getByRole('checkbox');

    expect(checkedInput).not.toBeChecked();
    await checkedInput.click();
    expect(checkedInput).toBeChecked();
  });

  it('checkbox: updates the title text on type', async () => {
    await renderAddListDialog();

    const { checkboxList } = getAllElements();

    const titleInput = checkboxList.getByPlaceholder('checklist');

    await titleInput.fill('Morning run');
    expect(titleInput).toHaveValue('Morning run');
  });
});
