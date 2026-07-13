import {
  graphqlErrorMock,
  mockImageUrl,
  networkErrorMock,
  noDataMock,
  successMock,
} from './singleBoardQuery.mock';
import { formatDate } from '@/utils/formatter/helper';
import { page } from 'vitest/browser';
import { renderBoard } from './testUtils';

vi.mock('@/components/Mutation/List/AddListDialog', () => ({
  default: () => <div data-testid='mock-add-list-dialog' />,
}));
vi.mock('@/components/Mutation/Card/AddCardDialog', () => ({
  default: () => <div data-testid='mock-add-card-dialog' />,
}));
vi.mock('@/components/Mutation/Card/UpdateCardDialog', () => ({
  default: () => <div data-testid='mock-update-card-dialog' />,
}));
vi.mock('@/components/Mutation/List/UpdateListDialog', () => ({
  default: () => <div data-testid='mock-update-list-dialog' />,
}));
vi.mock('@/components/Mutation/Board/ListField/ListFieldDialog', () => ({
  default: () => <div data-testid='mock-add-list-field-dialog' />,
}));
vi.mock('@/components/BoardPage/ActionMenuContainer', () => ({
  default: () => <div data-testid='mock-action-menu-container' />,
}));

const getAllElements = () => {
  const cards = page.getByRole('article');
  const lists = page
    .getByRole('listitem')
    .filter({ has: page.getByRole('list') });

  return {
    loading: page.getByLabelText('loading'),
    error: page.getByText(/an error occurred/i),
    noData: page.getByText(/no data found/i),
    card: cards.nth(0).filter({ hasText: /test card/i }),
    list: lists.nth(0),
  };
};

// ---------------------------------------------------------------------------
// Single Board Page
// ---------------------------------------------------------------------------
describe('Singe board page is rendered correctly', () => {
  it('render an error when network error occurs', async () => {
    await renderBoard([networkErrorMock]);
    const { loading, error } = getAllElements();
    await expect.element(loading).not.toBeInTheDocument();
    await expect.element(error).toBeInTheDocument();
  });

  it('render an error when GraphQL error occurs', async () => {
    await renderBoard([graphqlErrorMock]);
    const { loading, error } = getAllElements();
    await expect.element(loading).not.toBeInTheDocument();
    await expect.element(error).toBeInTheDocument();
  });

  it('render no data found when returned data is empty', async () => {
    await renderBoard([noDataMock]);
    const { loading, noData } = getAllElements();
    await expect.element(loading).not.toBeInTheDocument();
    await expect.element(noData).toBeInTheDocument();
  });

  it('render board, card, list with values correctly', async () => {
    await renderBoard([successMock]);
    const { loading, card, list } = getAllElements();
    await expect.element(loading).not.toBeInTheDocument();

    // Display board title, card and list
    expect(card).toBeVisible();
    expect(list).toBeVisible();

    // Display all list values
    const listValues = list.getByRole('listitem');
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
