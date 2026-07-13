import { toast } from 'react-toastify';
import { userEvent } from 'vitest/browser';
import { getAllElements, openActionMenu, renderActionMenu } from './testUtils';

describe('ActionMenu Delete board action', () => {
  it('runs the "Delete board" placeholder action from the menu', async () => {
    await renderActionMenu();
    const { deleteBoardButton } = getAllElements();

    await openActionMenu();
    await userEvent.click(deleteBoardButton);

    expect(toast.info).toHaveBeenCalledWith('Delete board action selected');
  });
});
