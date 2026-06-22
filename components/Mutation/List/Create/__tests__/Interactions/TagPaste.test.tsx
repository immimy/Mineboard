import { userEvent } from 'vitest/browser';
import { getAllElements, renderAddListDialog } from '../testUtils';
import { mockedUseBoardContext } from '../testMocks';

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
});
afterAll(() => {
  vi.resetAllMocks();
});

// ───────────────────────────────────────────────────────────
// Interaction
// ───────────────────────────────────────────────────────────

describe('AddListDialog interaction', () => {
  it('tag: converts pasted text to tags correctly', async () => {
    await renderAddListDialog();

    const { tagList, textList } = getAllElements();
    const tagInput = tagList.getByPlaceholder(/add tag/i);
    const textInput = textList.getByLabelText(/note/i);

    // write to ' exercise  to-do '
    await textInput.fill(' exercise  to-do ');

    // select and copy ' exercise  to-do ' to clipboard
    await textInput.tripleClick();
    await userEvent.copy();

    // paste to tag input
    await tagInput.click();
    await userEvent.paste();

    expect(tagList.getByText('exercise')).toBeVisible();
    expect(tagList.getByText('to-do')).toBeVisible();
  });
});
