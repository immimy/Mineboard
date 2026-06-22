import { mockedUseBoardContext } from './testMocks';
import { getAllElements, renderAddCardDialog } from './testUtils';

vi.mock('@/utils/actions/card');
vi.mock('@/components/BoardPage/BoardContext', { spy: true });

beforeAll(() => {
  mockedUseBoardContext();
});
afterAll(() => {
  vi.resetAllMocks();
});

describe('AddCardDialog: renders inputs correctly', () => {
  it('renders title input and color palette options', async () => {
    await renderAddCardDialog();

    const { header, description, titleInput, colorGroup, firstPalette } =
      getAllElements();

    expect(header).toBeVisible();
    expect(description).toBeVisible();
    expect(titleInput).toBeVisible();
    expect(titleInput).toHaveAttribute('required');
    expect(colorGroup).toBeVisible();
    expect(firstPalette).toBeVisible();
  });

  it('selects the first color palette by default', async () => {
    await renderAddCardDialog();

    const { firstPalette } = getAllElements();

    expect(firstPalette).toBeChecked();
  });
});
