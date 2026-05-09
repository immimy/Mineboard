import {
  graphqlErrorMock,
  mockImageUrl,
  networkErrorMock,
  noDataMock,
  successMock,
} from './singleBoardQuery.mock';
import { formatDate } from '@/utils/formatter/helper';
import { getAllElements, renderSingleBoard } from './testUtils';

vi.mock('@/components/Mutation/List/Create/AddListDialog', () => ({
  default: () => <div data-testid='mock-add-list-dialog' />,
}));

// ---------------------------------------------------------------------------
// Single Board Page
// ---------------------------------------------------------------------------
describe('Singe board page is rendered correctly', () => {
  it('render an error when network error occurs', async () => {
    await renderSingleBoard([networkErrorMock]);
    const { loading, error } = getAllElements();
    await expect.element(loading).not.toBeInTheDocument();
    await expect.element(error).toBeInTheDocument();
  });

  it('render an error when GraphQL error occurs', async () => {
    await renderSingleBoard([graphqlErrorMock]);
    const { loading, error } = getAllElements();
    await expect.element(loading).not.toBeInTheDocument();
    await expect.element(error).toBeInTheDocument();
  });

  it('render no data found when returned data is empty', async () => {
    await renderSingleBoard([noDataMock]);
    const { loading, noData } = getAllElements();
    await expect.element(loading).not.toBeInTheDocument();
    await expect.element(noData).toBeInTheDocument();
  });

  it('render board, card, list with values correctly', async () => {
    await renderSingleBoard([successMock]);
    const { loading, boardTitle, card1, list1 } = getAllElements();
    await expect.element(loading).not.toBeInTheDocument();

    // Display board title, card and list
    expect(boardTitle).toBeVisible();
    expect(card1).toBeVisible();
    expect(list1).toBeVisible();

    // Display all list values
    const listValues = list1.getByRole('listitem');
    expect(listValues).toHaveLength(6);
    // Display list values according to types
    // and arrange the orders correctly
    // 1. Checkbox
    const checkbox = listValues.nth(0);
    expect(checkbox.getByRole('checkbox', { checked: false })).toBeVisible();
    expect(checkbox.getByLabelText(/mark as done/i)).toBeVisible();
    // 2. Date
    const date = listValues.nth(1);
    expect(
      date.getByRole('heading', { level: 6, name: /deadline/i }),
    ).toBeVisible();
    const formattedDate = formatDate('2026-04-10T17:00:00Z', false);
    expect(
      date.getByRole('paragraph', { hasText: formattedDate }),
    ).toBeVisible();
    // 3. Text
    const text = listValues.nth(2);
    expect(
      text.getByRole('heading', {
        level: 6,
        name: /note/i,
      }),
    ).toBeVisible();
    expect(
      text.getByRole('paragraph', { hasText: /start with atomic habits/i }),
    ).toBeVisible();

    // 4. Tag
    const tag = listValues.nth(3);
    expect(tag.getByText(/groceries/i)).toBeVisible();
    expect(tag.getByText(/errands/i)).toBeVisible();

    // 5. Image
    const image = listValues.nth(4);
    const imageEl = image.getByRole('img', { name: mockImageUrl });
    expect(image.getByText(/cover/i)).toBeVisible();
    expect(imageEl).toHaveAttribute('src', mockImageUrl);
    expect(imageEl).toBeVisible();

    // 6. Number
    const number = listValues.nth(5);
    expect(
      number.getByRole('heading', { level: 6, name: /estimate/i }),
    ).toBeVisible();
    expect(number.getByRole('paragraph').nth(0)).toHaveTextContent(/8/i);
    expect(number.getByRole('paragraph').nth(1)).toHaveTextContent('hrs');
  });
});
