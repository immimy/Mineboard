import * as cardActions from '@/utils/actions/card';
import { UPDATE_CARD_SUCCESS } from './testMocks';
import {
  getAllElements,
  openUpdateCardDialog,
  renderUpdateCardDialog,
} from './testUtils';

vi.mock('@/utils/actions/card');

beforeEach(() => {
  vi.mocked(cardActions.updateCard).mockResolvedValue(UPDATE_CARD_SUCCESS);
});

describe('UpdateCardDialog form submission', () => {
  it('closes the dialog after the success', async () => {
    renderUpdateCardDialog();

    const { header, titleInput, saveButton } = getAllElements();

    await openUpdateCardDialog();
    await titleInput.fill('Close card');
    await saveButton.click();

    await vi.waitFor(() => {
      expect(header.query()).toBe(null);
    });
  });
});
