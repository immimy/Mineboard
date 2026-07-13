import * as cardActions from '@/utils/actions/card';
import { toast } from 'react-toastify';
import { missingCardIdForm, UPDATE_CARD_FAIL } from './testMocks';
import {
  getAllElements,
  openUpdateCardDialog,
  renderUpdateCardDialog,
} from './testUtils';

vi.mock('@/utils/actions/card');

beforeEach(() => {
  vi.mocked(cardActions.updateCard).mockResolvedValue(UPDATE_CARD_FAIL);
});

describe('UpdateCardDialog form submission', () => {
  it('shows an error toast and keeps dialog open when updateCard fails', async () => {
    renderUpdateCardDialog();

    const { header, titleInput, saveButton } = getAllElements();

    await openUpdateCardDialog();
    await titleInput.fill('Error card');
    await saveButton.click();

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update card');
    });
    await expect.element(header).toBeVisible();
  });

  it('shows a guard error and does not call updateCard when no card is selected', async () => {
    renderUpdateCardDialog({ initialForm: missingCardIdForm });

    const { header, saveButton } = getAllElements();

    await openUpdateCardDialog();
    await saveButton.click();

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Card is not selected');
    });
    expect(cardActions.updateCard).not.toHaveBeenCalled();
    await expect.element(header).toBeVisible();
  });
});
