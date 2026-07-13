import * as cardActions from '@/utils/actions/card';
import { CREATE_CARD_SUCCESS, mockedUseBoardContext } from './testMocks';
import {
  getAllElements,
  openAddCardDialog,
  renderAddCardDialog,
} from './testUtils';

vi.mock('@/utils/actions/card');
vi.mock('@/components/BoardPage/BoardContext', { spy: true });

beforeAll(() => {
  mockedUseBoardContext();
  vi.mocked(cardActions.createCard).mockResolvedValue(CREATE_CARD_SUCCESS);
});
afterAll(() => {
  vi.resetAllMocks();
});

describe('AddCardDialog form submission', () => {
  it('closes the dialog after the success ', async () => {
    await renderAddCardDialog();

    const { header, titleInput, saveButton } = getAllElements();

    await openAddCardDialog();
    await titleInput.fill('Close card');
    await saveButton.click();

    await vi.waitFor(() => {
      expect(header.query()).toBe(null);
    });
  });
});
