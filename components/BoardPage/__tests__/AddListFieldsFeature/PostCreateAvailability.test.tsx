import * as boardActions from '@/utils/actions/board';
import { userEvent } from 'vitest/browser';
import { CREATE_LIST_FIELDS_SUCCESS } from './testMocks';
import {
  expectTextListFieldActionCall,
  getAllElements,
  openListFieldsFromEmptyState,
  renderBoard,
  saveTextListField,
} from './testUtils';

vi.mock('@/utils/actions/board', () => ({ createListFields: vi.fn() }));
vi.mock('@/utils/actions/card');
vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

beforeEach(() => {
  vi.mocked(boardActions.createListFields).mockResolvedValue(
    CREATE_LIST_FIELDS_SUCCESS,
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('Add list fields post-create availability', () => {
  it('makes add card available after list fields are created', async () => {
    await renderBoard();

    const {
      addCardButton,
      listFieldsFormIntro,
      noCardsHeading,
      createCardHeading,
    } = getAllElements();

    await expect.element(addCardButton).toBeDisabled();

    await openListFieldsFromEmptyState();
    await saveTextListField('Note');

    await vi.waitFor(() => {
      expectTextListFieldActionCall(boardActions.createListFields, 'Note');
    });

    await expect.element(listFieldsFormIntro).not.toBeInTheDocument();
    await expect.element(noCardsHeading).toBeVisible();
    await expect.element(addCardButton).toBeEnabled();

    await userEvent.click(addCardButton);

    await expect.element(createCardHeading).toBeVisible();
  });
});
