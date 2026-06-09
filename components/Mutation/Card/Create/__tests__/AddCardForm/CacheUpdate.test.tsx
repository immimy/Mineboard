import * as cardActions from '@/utils/actions/card';
import { InMemoryCache } from '@apollo/client-integration-nextjs';
import { CREATE_CARD_SUCCESS, mockedUseBoardContext } from '../testMocks';
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
  it('updates Apollo cache after successful submission', async () => {
    const mockCache = vi.mockObject(new InMemoryCache(), { spy: true });
    await renderAddCardDialog(mockCache);

    const { titleInput, saveButton } = getAllElements();
    await titleInput.fill('Cache card');
    await saveButton.click();

    const newCreatedCard =
      CREATE_CARD_SUCCESS.data.cardsCollection?.edges[0].node;

    expect(mockCache.writeFragment).toHaveBeenCalledWith(
      expect.objectContaining({
        fragmentName: 'CreatedCard',
        data: newCreatedCard,
      }),
    );
    expect(mockCache.modify).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'ROOT_QUERY',
        fields: expect.objectContaining({
          cardsCollection: expect.any(Function),
        }),
      }),
    );
  });
});
