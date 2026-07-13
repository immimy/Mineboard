import * as cardActions from '@/utils/actions/card';
import {
  getAllElements,
  openUpdateCardDialog,
  renderUpdateCardDialog,
} from './testUtils';

vi.mock('@/utils/actions/card');

describe('UpdateCardDialog form submission', () => {
  it('blocks empty title submission with native required validation', async () => {
    renderUpdateCardDialog();

    const { header, titleInput, saveButton } = getAllElements();

    await openUpdateCardDialog();
    await titleInput.fill('');
    await saveButton.click();

    await expect.element(titleInput).toBeInvalid();
    expect(cardActions.updateCard).not.toHaveBeenCalled();
    await expect.element(header).toBeVisible();
  });
});
