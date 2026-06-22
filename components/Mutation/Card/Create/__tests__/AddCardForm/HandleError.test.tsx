import * as cardActions from '@/utils/actions/card';
import { toast } from 'react-toastify';
import {
  CREATE_CARD_FAIL,
  mockCloseAddCard,
  mockedUseBoardContext,
} from '../testMocks';
import { getAllElements, renderAddCardDialog } from '../testUtils';

vi.mock('@/utils/actions/card');
vi.mock('@/components/BoardPage/BoardContext', { spy: true });

beforeAll(() => {
  mockedUseBoardContext();
  vi.mocked(cardActions.createCard).mockResolvedValue(CREATE_CARD_FAIL);
});
afterAll(() => {
  vi.resetAllMocks();
});

describe('AddCardDialog form submission', () => {
  it('shows an error toast and keeps dialog open when createCard fails', async () => {
    await renderAddCardDialog();

    const { titleInput, saveButton } = getAllElements();
    await titleInput.fill('Error card');
    await saveButton.click();

    expect(toast.error).toHaveBeenCalledWith('Failed to add card');
    expect(mockCloseAddCard).not.toHaveBeenCalled();
  });
});
