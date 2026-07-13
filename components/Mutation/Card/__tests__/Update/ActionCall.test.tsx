import { mockCardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { ColorPalette } from '@/types/jsonbSchema';
import * as cardActions from '@/utils/actions/card';
import { UPDATE_CARD_FAIL } from './testMocks';
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
  it('calls updateCard with cardId and current form data', async () => {
    renderUpdateCardDialog();

    const { titleInput, thirdPalette, saveButton } = getAllElements();

    await openUpdateCardDialog();
    await titleInput.fill('Updated card');
    await thirdPalette.click();
    await saveButton.click();

    await vi.waitFor(() => {
      expect(cardActions.updateCard).toHaveBeenCalledOnce();
    });

    const formData = vi.mocked(cardActions.updateCard).mock.calls[0][0];

    expect(formData.get('cardId')).toBe(mockCardId);
    expect(formData.get('title')).toBe('Updated card');
    expect(formData.get('color')).toBe(String(ColorPalette.third));
  });

  it('submits the selected card color when no palette is changed', async () => {
    renderUpdateCardDialog();

    const { titleInput, saveButton } = getAllElements();

    await openUpdateCardDialog();
    await titleInput.fill('Title only update');
    await saveButton.click();

    await vi.waitFor(() => {
      expect(cardActions.updateCard).toHaveBeenCalledOnce();
    });

    const formData = vi.mocked(cardActions.updateCard).mock.calls[0][0];

    expect(formData.get('color')).toBe(String(ColorPalette.first));
  });
});
