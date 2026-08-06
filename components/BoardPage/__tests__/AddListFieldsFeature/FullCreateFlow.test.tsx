import { mockBoardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { ColorPalette } from '@/types/jsonbSchema';
import * as boardActions from '@/utils/actions/board';
import * as cardActions from '@/utils/actions/card';
import * as listActions from '@/utils/actions/list';
import { page, userEvent } from 'vitest/browser';
import {
  CREATE_CARD_SUCCESS,
  CREATE_LIST_FIELDS_SUCCESS,
  CREATE_LIST_SUCCESS,
  createdCardId,
  createdTextFieldId,
} from './testMocks';
import {
  getAllElements,
  openListFieldsFromEmptyState,
  renderBoard,
  saveTextListField,
} from './testUtils';

vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

beforeEach(() => {
  vi.mocked(boardActions.createListFields).mockResolvedValue(
    CREATE_LIST_FIELDS_SUCCESS,
  );
  vi.mocked(cardActions.createCard).mockResolvedValue(CREATE_CARD_SUCCESS);
  vi.mocked(listActions.createList).mockResolvedValue(CREATE_LIST_SUCCESS);
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('Add list fields full create flow', () => {
  it('creates list fields, a card, and a list with values that render on the new card', async () => {
    await renderBoard();

    const { addCardButton, saveButton } = getAllElements();

    await openListFieldsFromEmptyState();
    await saveTextListField();

    await vi.waitFor(() => {
      expect(boardActions.createListFields).toHaveBeenCalledOnce();
    });

    await userEvent.click(addCardButton);

    const cardTitleInput = page.getByLabelText(/title/i);
    const thirdPalette = page.getByRole('radio', { name: /palette 3/i });

    await cardTitleInput.fill('Career roadmap');
    await thirdPalette.click();
    await saveButton.click();

    await vi.waitFor(() => {
      expect(cardActions.createCard).toHaveBeenCalledOnce();
    });

    const formData = vi.mocked(cardActions.createCard).mock.calls[0][0];
    expect(formData.get('boardId')).toBe(mockBoardId);
    expect(formData.get('title')).toBe('Career roadmap');
    expect(formData.get('color')).toBe(String(ColorPalette.third));

    const newCard = page
      .getByRole('article')
      .filter({ hasText: /career roadmap/i });
    await expect.element(newCard).toBeVisible();

    const addListButton = newCard.getByRole('button', { name: /add list/i });
    await userEvent.click(addListButton);

    const listTextInput = page.getByPlaceholder('Type here...');

    await listTextInput.fill('Practice cache updates');
    await saveButton.click();

    await vi.waitFor(() => {
      expect(listActions.createList).toHaveBeenCalledWith(
        mockBoardId,
        createdCardId,
        expect.objectContaining({
          [createdTextFieldId]: expect.objectContaining({
            value: 'Practice cache updates',
          }),
        }),
      );
    });

    const noteHeading = newCard.getByRole('heading', { name: /note/i });
    const listValue = newCard.getByText(/practice cache updates/i);

    await expect.element(noteHeading).toBeVisible();
    await expect.element(listValue).toBeVisible();
  });
});
