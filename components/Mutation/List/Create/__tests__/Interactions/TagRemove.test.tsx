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
  it('tag: removes the last tag on Backspace when input is empty', async () => {
    await renderAddListDialog();

    const { tagList } = getAllElements();
    const tagInput = tagList.getByPlaceholder(/add tag/i);

    await tagInput.fill('todo');
    await userEvent.keyboard('{Enter}');
    expect(tagList.getByText('todo')).toBeVisible();

    // input is now empty — Backspace removes the last tag
    await userEvent.keyboard('{Backspace}');
    expect(tagInput.getByText('todo').query()).toBe(null);
  });
});
