import { ColorPalette } from '@/types/jsonbSchema';
import * as cardActions from '@/utils/actions/card';
import { page, userEvent } from 'vitest/browser';
import { mockCardId, successMock } from './singleBoardQuery.mock';
import { renderBoard } from './testUtils';

vi.mock('@/utils/actions/card');
vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');
vi.mock('@/components/Mutation/Board/ListField/ListFieldDialog', () => ({
  default: () => <div data-testid='mock-add-list-field-dialog' />,
}));

const UPDATE_CARD_SUCCESS = {
  data: {
    __typename: 'cards' as const,
    id: mockCardId,
    title: 'Once upon a time',
    color: ColorPalette.third,
  },
  error: null,
};

const getAllElements = () => {
  const cards = page.getByRole('article');

  return {
    originalCard: cards.filter({ hasText: /test card/i }),
    updateCardButton: page.getByRole('button', { name: /update test card/i }),
    dialogHeading: page.getByRole('heading', { name: /update card/i }),
    titleInput: page.getByLabelText(/title/i),
    thirdPalette: page.getByRole('radio', { name: /palette 3/i }),
    saveButton: page.getByRole('button', { name: /save/i }),
  };
};

beforeEach(() => {
  vi.mocked(cardActions.updateCard).mockResolvedValue(UPDATE_CARD_SUCCESS);
});

describe('Update card feature', () => {
  it('renders the updated card after successful submission', async () => {
    renderBoard([successMock]);

    const {
      originalCard,
      updateCardButton,
      dialogHeading,
      titleInput,
      thirdPalette,
      saveButton,
    } = getAllElements();

    await expect.element(originalCard).toBeVisible();

    await userEvent.click(updateCardButton);
    await expect.element(dialogHeading).toBeVisible();

    await titleInput.fill('  Once upon a time  ');
    await userEvent.click(thirdPalette);
    await userEvent.click(saveButton);

    await vi.waitFor(() => {
      expect(cardActions.updateCard).toHaveBeenCalledOnce();
    });

    const formData = vi.mocked(cardActions.updateCard).mock.calls[0][0];
    expect(formData.get('cardId')).toBe(mockCardId);
    expect(formData.get('title')).toBe('  Once upon a time  ');
    expect(formData.get('color')).toBe(String(ColorPalette.third));

    const updatedCard = page
      .getByRole('article')
      .filter({ hasText: /once upon a time/i });
    const updatedCardButton = page.getByRole('button', {
      name: /update once upon a time/i,
    });
    await expect.element(updatedCard).toBeVisible();
    await expect.element(updatedCard).toHaveClass(/border-t-card-3/);
    await expect.element(updatedCardButton).toBeVisible();
  });
});
