import { page, userEvent } from 'vitest/browser';
import {
  mockBoardId,
  successMock,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { CREATE_CARD_SUCCESS } from '@/components/Mutation/Card/__tests__/Create/testMocks';
import { ColorPalette } from '@/types/jsonbSchema';
import * as cardActions from '@/utils/actions/card';
import { renderBoard } from './testUtils';

// ───────────────────────────────────────────────────────────
// Mocks
// ───────────────────────────────────────────────────────────

vi.mock('@/utils/actions/card');
vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');
vi.mock('@/components/Mutation/Board/ListField/ListFieldDialog', () => ({
  default: () => <div data-testid='mock-add-list-field-dialog' />,
}));

// ───────────────────────────────────────────────────────────
// Setup
// ───────────────────────────────────────────────────────────

beforeAll(() => {
  vi.mocked(cardActions.createCard).mockResolvedValue(CREATE_CARD_SUCCESS);
});
afterAll(() => {
  vi.resetAllMocks();
});

const getAllElements = () => {
  const cards = page.getByRole('article');

  return {
    loading: page.getByLabelText('loading'),
    addCardDialogButton: page.getByRole('button', { name: /add new card/i }),
    titleInput: page.getByLabelText(/title/i),
    thirdPalette: page.getByRole('radio', { name: /palette 3/i }),
    saveButton: page.getByRole('button', { name: /save/i }),
    newCard: cards.nth(1).filter({ hasText: /career roadmap/i }),
  };
};

// ───────────────────────────────────────────────────────────
// Add card feature
// ───────────────────────────────────────────────────────────

describe('Add card feature', () => {
  it('renders new card after successful submission', async () => {
    await renderBoard([successMock]);

    const {
      loading,
      addCardDialogButton,
      titleInput,
      thirdPalette,
      saveButton,
      newCard,
    } = getAllElements();

    await expect.element(loading).not.toBeInTheDocument();
    await userEvent.click(addCardDialogButton);

    await titleInput.fill('Career roadmap');
    await thirdPalette.click();
    await saveButton.click();

    await vi.waitFor(() => {
      expect(cardActions.createCard).toHaveBeenCalledOnce();
    });

    const formData = vi.mocked(cardActions.createCard).mock.calls[0][0];
    expect(formData.get('boardId')).toBe(mockBoardId);
    expect(formData.get('title')).toBe('Career roadmap');
    expect(formData.get('color')).toBe(String(ColorPalette.third));

    await expect.element(newCard).toBeVisible();
  });
});
