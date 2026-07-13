import * as cardActions from '@/utils/actions/card';
import { mockedUseBoardContext } from './testMocks';
import {
  getAllElements,
  openAddCardDialog,
  renderAddCardDialog,
} from './testUtils';

vi.mock('@/utils/actions/card');
vi.mock('@/components/BoardPage/BoardContext', { spy: true });

beforeAll(() => {
  mockedUseBoardContext();
});
afterAll(() => {
  vi.resetAllMocks();
});

describe('AddCardDialog form submission', () => {
  it('blocks empty title submission with native required validation', async () => {
    await renderAddCardDialog();

    const { header, titleInput, saveButton } = getAllElements();

    await openAddCardDialog();
    await saveButton.click();

    expect(titleInput).toBeInvalid();
    expect(cardActions.createCard).not.toHaveBeenCalled();
    expect(header).toBeVisible();
  });
});
