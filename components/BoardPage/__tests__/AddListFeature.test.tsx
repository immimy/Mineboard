import {
  mockBoardId,
  mockCardId,
  mockDateId,
  mockTextId,
  successMock,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { page, userEvent } from 'vitest/browser';
import { renderBoard } from './testUtils';
import * as listActions from '@/utils/actions/list';
import { CREATE_LIST_SUCCESS } from '@/components/Mutation/List/__tests__/Create/testMocks';
import { formatDate } from '@/utils/formatter/helper';

// ───────────────────────────────────────────────────────────
// Mocks
// ───────────────────────────────────────────────────────────

vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');
vi.mock('@/components/Mutation/Card/AddCardDialog', () => ({
  default: () => <div data-testid='mock-add-card-dialog' />,
}));
vi.mock('@/components/Mutation/Board/ListField/ListFieldDialog', () => ({
  default: () => <div data-testid='mock-add-list-field-dialog' />,
}));
vi.mock('@/components/Mutation/Card/UpdateCardDialog', () => ({
  default: () => <div data-testid='mock-update-card-dialog' />,
}));
vi.mock('@/components/Mutation/List/UpdateListDialog', () => ({
  default: () => <div data-testid='mock-update-list-dialog' />,
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

const getAllElements = () => {
  const lists = page
    .getByRole('listitem')
    .filter({ has: page.getByRole('list') });

  return {
    loading: page.getByLabelText('loading'),
    addListDialogButton: page.getByRole('button', { name: /add list/i }),
    saveButton: page.getByRole('button', { name: /save/i }),
    dateInput: page.getByLabelText(/deadline/i),
    textInput: page.getByLabelText(/note/i),
    newList: lists.nth(1),
  };
};

// ───────────────────────────────────────────────────────────
// Add list feature
// ───────────────────────────────────────────────────────────

describe('Add list feature', () => {
  it('renders new list after successful submission', async () => {
    await renderBoard([successMock]);

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
    await vi.waitFor(() => {
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
    });

    const newListValues = newList.getByRole('listitem');
    // New list contain two values
    await vi.waitFor(() => {
      expect(newListValues).toHaveLength(2);
    });
    // First value renders as date
    const date = newListValues.nth(0);
    await expect
      .element(date.getByRole('heading', { level: 6, name: /deadline/i }))
      .toBeVisible();
    const formattedDate = formatDate('2026-12-24', false);
    await expect
      .element(date.getByRole('paragraph', { hasText: formattedDate }))
      .toBeVisible();
    // Second value renders as text
    const text = newListValues.nth(1);
    await expect
      .element(
        text.getByRole('heading', {
          level: 6,
          name: /note/i,
        }),
      )
      .toBeVisible();
    await expect
      .element(
        text.getByRole('paragraph', {
          hasText: /decorate Christmas tree/i,
        }),
      )
      .toBeVisible();
  });
});
