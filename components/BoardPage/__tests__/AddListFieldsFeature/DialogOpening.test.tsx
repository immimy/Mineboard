import { page, userEvent } from 'vitest/browser';
import { getAllElements, renderBoard } from './testUtils';

vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

describe('Add list fields dialog opening', () => {
  it('opens the add list fields dialog from the action menu button', async () => {
    await renderBoard();

    const { loading, listFieldsFormIntro } = getAllElements();
    const menuToggle = page.getByRole('button', {
      name: /action menu button/i,
    });
    const customListFieldsMenuItem = page.getByRole('menuitem', {
      name: /custom list fields/i,
    });

    await expect.element(loading).not.toBeInTheDocument();

    await userEvent.click(menuToggle);
    await userEvent.click(customListFieldsMenuItem);

    await expect.element(listFieldsFormIntro).toBeVisible();
  });
});
