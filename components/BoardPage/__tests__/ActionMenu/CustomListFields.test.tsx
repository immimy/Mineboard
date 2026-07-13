import { userEvent } from 'vitest/browser';
import { getAllElements, openActionMenu, renderActionMenu } from './testUtils';

describe('ActionMenu Custom list fields action', () => {
  it('runs the "Custom list fields" action from the menu', async () => {
    await renderActionMenu();
    const { customListFieldsButton, listFieldsDescription } = getAllElements();

    await openActionMenu();
    await userEvent.click(customListFieldsButton);

    await expect.element(listFieldsDescription).toBeInTheDocument();
  });
});
