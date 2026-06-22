import { page, userEvent } from 'vitest/browser';
import { getAllElements, renderBoard } from './testUtils';
import * as boardActions from '@/utils/actions/board';

vi.mock('@/utils/actions/board', () => ({ createListFields: vi.fn() }));
vi.mock('@/utils/actions/card');
vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

describe('Add list fields empty board state', () => {
  it('renders the add list fields empty state when there are no list fields', async () => {
    await renderBoard();

    const {
      loading,
      noListFieldsHeading,
      emptyStateCreateButton,
      addCardButton,
    } = getAllElements();

    await expect.element(loading).not.toBeInTheDocument();
    await expect.element(noListFieldsHeading).toBeVisible();
    await expect.element(emptyStateCreateButton).toBeInTheDocument();
    await expect.element(addCardButton).toBeDisabled();
  });

  it('keeps add card unavailable before any list fields exist', async () => {
    await renderBoard();

    const { loading, addCardButton, createCardHeading } = getAllElements();

    await expect.element(loading).not.toBeInTheDocument();
    await expect.element(addCardButton).toBeDisabled();
    await addCardButton.click({ force: true });
    await expect.element(createCardHeading).not.toBeInTheDocument();
  });

  it('opens the add list fields dialog from the empty cards container', async () => {
    await renderBoard();

    const { loading, emptyStateCreateButton, listFieldsFormIntro } =
      getAllElements();

    await expect.element(loading).not.toBeInTheDocument();
    await userEvent.click(emptyStateCreateButton);

    await expect.element(listFieldsFormIntro).toBeVisible();
    expect(boardActions.createListFields).not.toHaveBeenCalled();
  });

  it('does not render card or list content before a card exists', async () => {
    await renderBoard();

    const { loading } = getAllElements();
    const card = page.getByRole('article').nth(0);
    const addListButton = page.getByRole('button', { name: /add list/i });

    await expect.element(loading).not.toBeInTheDocument();
    await expect.element(card).not.toBeInTheDocument();
    await expect.element(addListButton).not.toBeInTheDocument();
  });
});
