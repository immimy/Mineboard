import { mockBoardId } from '@/components/Board/__tests__/singleBoardQuery.mock';
import { ColorPalette } from '@/types/jsonbSchema';
import * as cardActions from '@/utils/actions/card';
import { CREATE_CARD_FAIL, mockedUseBoardContext } from '../testMocks';
import { getAllElements, renderAddCardDialog } from '../testUtils';

vi.mock('@/utils/actions/card');
vi.mock('@/components/Board/BoardContext', { spy: true });

beforeAll(() => {
  mockedUseBoardContext();
  vi.mocked(cardActions.createCard).mockResolvedValue(CREATE_CARD_FAIL);
});
afterAll(() => {
  vi.resetAllMocks();
});

describe('AddCardDialog form submission', () => {
  it('calls createCard with boardId and current form data', async () => {
    await renderAddCardDialog();

    const { titleInput, thirdPalette, saveButton } = getAllElements();

    await titleInput.fill('Career roadmap');
    await thirdPalette.click();
    await saveButton.click();

    expect(cardActions.createCard).toHaveBeenCalledOnce();

    const formData = vi.mocked(cardActions.createCard).mock.calls[0][0];

    expect(formData.get('boardId')).toBe(mockBoardId);
    expect(formData.get('title')).toBe('Career roadmap');
    expect(formData.get('color')).toBe(String(ColorPalette.third));
  });

  it('submits the default color when no palette is selected manually', async () => {
    await renderAddCardDialog();

    const { titleInput, saveButton } = getAllElements();

    await titleInput.fill('Default color card');
    await saveButton.click();

    const formData = vi.mocked(cardActions.createCard).mock.calls[0][0];

    expect(formData.get('color')).toBe(String(ColorPalette.first));
  });
});
