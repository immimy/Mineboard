import * as cardActions from '@/utils/actions/card';
import {
  CREATE_CARD_SUCCESS,
  mockCloseAddCard,
  mockedUseBoardContext,
} from '../testMocks';
import { getAllElements, renderAddCardDialog } from '../testUtils';

vi.mock('@/utils/actions/card');
vi.mock('@/components/Board/BoardContext', { spy: true });

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

    const { titleInput, saveButton } = getAllElements();
    await titleInput.fill('Close card');
    await saveButton.click();

    expect(mockCloseAddCard).toHaveBeenCalledOnce();
  });
});
