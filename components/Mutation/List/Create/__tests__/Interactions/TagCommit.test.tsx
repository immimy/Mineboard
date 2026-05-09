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
  it('tag: commits a tag on Enter and clears the input', async () => {
    await renderAddListDialog();

    const { tagList } = getAllElements();
    const tagInput = tagList.getByPlaceholder(/add tag/i);

    await tagInput.fill('groceries');
    await userEvent.keyboard('{Enter}');

    expect(tagList.getByText('groceries')).toBeVisible();
    expect(tagInput).toHaveValue('');
  });

  it('tag: commits a tag on Space', async () => {
    await renderAddListDialog();

    const { tagList } = getAllElements();
    const tagInput = tagList.getByPlaceholder(/add tag/i);

    await tagInput.fill('work');
    await userEvent.keyboard('{Space}');

    expect(tagList.getByText('work')).toBeVisible();
  });
});
