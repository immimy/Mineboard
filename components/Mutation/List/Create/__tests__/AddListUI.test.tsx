import { mockedUseBoardContext } from './testMocks';
import { getAllElements, renderAddListDialog } from './testUtils';

// ───────────────────────────────────────────────────────────
// Mocks
// ───────────────────────────────────────────────────────────

vi.mock('@/utils/actions/list');
vi.mock('@/components/Board/BoardContext', { spy: true });
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

// ───────────────────────────────────────────────────────────
// Setup
// ───────────────────────────────────────────────────────────

beforeAll(() => {
  mockedUseBoardContext();
});
afterAll(() => {
  vi.resetAllMocks();
});

// ───────────────────────────────────────────────────────────
// Rendering UI correctly
// ───────────────────────────────────────────────────────────

describe('AddListDialog: renders inputs according to list fields correctly', () => {
  it('renders checkbox input correctly', async () => {
    await renderAddListDialog();

    const { checkboxList } = getAllElements();

    const checkedInput = checkboxList.getByRole('checkbox');
    const titleInput = checkboxList.getByPlaceholder('checklist');

    expect(checkedInput).toBeVisible();
    expect(titleInput).toBeVisible();
  });

  it('renders date input correctly', async () => {
    await renderAddListDialog();

    const { dateList } = getAllElements();

    const dateInput = dateList.getByLabelText(/deadline/i);

    expect(dateInput).toBeVisible();
    expect(dateInput).toHaveAttribute('type', 'date');
  });

  it('renders text input correctly', async () => {
    await renderAddListDialog();

    const { textList } = getAllElements();

    const textInput = textList.getByLabelText(/note/i);

    expect(textInput).toBeVisible();
  });

  it('renders tag input correctly', async () => {
    await renderAddListDialog();

    const { tagList } = getAllElements();

    const tagInput = tagList.getByPlaceholder(/add tag/i);

    expect(tagInput).toBeVisible();
  });

  it('renders image input correctly', async () => {
    await renderAddListDialog();

    const { imageList } = getAllElements();

    const imageInput = imageList.getByTestId('mock-image-input');

    expect(imageInput).toBeVisible();
  });

  it('renders number input correctly', async () => {
    await renderAddListDialog();

    const { numberList } = getAllElements();

    const numberInput = numberList.getByLabelText(/estimate/i);
    const unit = numberList.getByText('hrs');

    expect(numberInput).toBeVisible();
    expect(numberInput).toHaveAttribute('type', 'number');
    expect(unit).toBeVisible();
  });
});
