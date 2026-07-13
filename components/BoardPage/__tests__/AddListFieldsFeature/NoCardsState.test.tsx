import { userEvent } from 'vitest/browser';
import { boardWithFieldsNoCardsMock } from './testMocks';
import { getAllElements, renderBoard } from './testUtils';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));
vi.mock('@/utils/actions/card');
vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

describe('Add list fields no cards state', () => {
  it('renders the add card empty state when list fields exist but no cards exist', async () => {
    await renderBoard([boardWithFieldsNoCardsMock]);

    const { loading, noCardsHeading, emptyStateCreateButton, addCardButton } =
      getAllElements();

    await expect.element(loading).not.toBeInTheDocument();
    await expect.element(noCardsHeading).toBeVisible();
    await expect.element(emptyStateCreateButton).toBeInTheDocument();
    await expect.element(addCardButton).toBeEnabled();
  });

  it('opens the add card dialog from the cards container create button', async () => {
    await renderBoard([boardWithFieldsNoCardsMock]);

    const { loading, emptyStateCreateButton, createCardHeading } =
      getAllElements();

    await expect.element(loading).not.toBeInTheDocument();
    await userEvent.click(emptyStateCreateButton);

    await expect.element(createCardHeading).toBeVisible();
  });
});
