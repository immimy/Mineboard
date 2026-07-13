import { userEvent } from 'vitest/browser';
import { getAllElements, renderActionMenu } from './testUtils';

describe('ActionMenu Add new card action', () => {
  it('renders "Add new card" as the permanent action button', async () => {
    await renderActionMenu();
    const { addNewCardButton } = getAllElements();

    await expect.element(addNewCardButton).toBeInTheDocument();
  });

  it('opens the Add Card dialog when "Add new card" is selected', async () => {
    await renderActionMenu();
    const { addNewCardButton, createCardHeader } = getAllElements();

    await userEvent.click(addNewCardButton);

    await expect.element(createCardHeader).toBeInTheDocument();
  });

  it('disables the Add Card action until list fields exist', async () => {
    await renderActionMenu(null);
    const { addNewCardButton, createCardHeader } = getAllElements();

    await expect.element(addNewCardButton).toBeDisabled();
    await addNewCardButton.click({ force: true });
    await expect.element(createCardHeader).not.toBeInTheDocument();
  });
});
