import { render } from 'vitest-browser-react';
import { MockedProvider } from '@apollo/client/testing/react';
import {
  mockBoardId,
  mockCardId,
  mockDateId,
  mockTextId,
  successMock,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { userEvent } from 'vitest/browser';
import BoardContainer from '@/components/BoardPage/BoardContainer';
import { getAllElements } from './testUtils';
import * as listActions from '@/utils/actions/list';
import { CREATE_LIST_SUCCESS } from '@/components/Mutation/List/Create/__tests__/testMocks';
import { formatDate } from '@/utils/formatter/helper';
import AppContextWrapper from '@/app/context';

// ───────────────────────────────────────────────────────────
// Mocks
// ───────────────────────────────────────────────────────────

vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');
vi.mock('@/components/Mutation/Card/Create/AddCardDialog', () => ({
  default: () => <div data-testid='mock-add-card-dialog' />,
}));
vi.mock('@/components/Mutation/Board/Create/AddListFieldDialog', () => ({
  default: () => <div data-testid='mock-add-list-field-dialog' />,
}));

// ───────────────────────────────────────────────────────────
// Setup
// ───────────────────────────────────────────────────────────

beforeAll(() => {
  vi.mocked(listActions.createList).mockResolvedValue(CREATE_LIST_SUCCESS);
});
afterAll(() => {
  vi.resetAllMocks();
});

// ───────────────────────────────────────────────────────────
// Add list feature
// ───────────────────────────────────────────────────────────

describe('Add list feature', () => {
  it('renders new list after successful submission', async () => {
    await render(
      <MockedProvider mocks={[successMock]}>
        <AppContextWrapper>
          <BoardContainer boardId={mockBoardId} />
        </AppContextWrapper>
      </MockedProvider>,
    );

    const {
      loading,
      addListDialogButton,
      saveButton,
      dateInput,
      textInput,
      newList,
    } = getAllElements();

    // Open the add list dialog
    await expect.element(loading).not.toBeInTheDocument();
    await userEvent.click(addListDialogButton);

    // Fill out the form
    // 1. Date
    await userEvent.type(dateInput, '12242026');
    // 2. Text
    await textInput.fill('Decorate Christmas tree');
    // Submit form
    await saveButton.click();

    // createList action have been called with correct values
    expect(listActions.createList).toHaveBeenCalledWith(
      mockBoardId,
      mockCardId,
      expect.objectContaining({
        [mockDateId]: expect.objectContaining({
          meta: {
            tzOffset: new Date().getTimezoneOffset(),
          },
          value: '2026-12-24',
        }),
        [mockTextId]: expect.objectContaining({
          value: 'Decorate Christmas tree',
        }),
      }),
    );

    const newListValues = newList.getByRole('listitem');
    // New list contain two values
    expect(newListValues).toHaveLength(2);
    // First value renders as date
    const date = newListValues.nth(0);
    expect(
      date.getByRole('heading', { level: 6, name: /deadline/i }),
    ).toBeVisible();
    const formattedDate = formatDate('2026-12-24', false);
    expect(
      date.getByRole('paragraph', { hasText: formattedDate }),
    ).toBeVisible();
    // Second value renders as text
    const text = newListValues.nth(1);
    expect(
      text.getByRole('heading', {
        level: 6,
        name: /note/i,
      }),
    ).toBeVisible();
    expect(
      text.getByRole('paragraph', { hasText: /decorate Christmas tree/i }),
    ).toBeVisible();
  });
});
