import * as listActions from '@/utils/actions/list';
import { page, userEvent } from 'vitest/browser';
import { mockImageUrl, successMock } from './singleBoardQuery.mock';
import { UPDATE_LIST_SUCCESS } from '@/components/Mutation/List/__tests__/Update/testMocks';
import { formatDate } from '@/utils/formatter/helper';
import { renderBoard } from './testUtils';

vi.mock('@/utils/actions/card');
vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');
vi.mock('@/components/Mutation/Board/ListField/ListFieldDialog', () => ({
  default: () => <div data-testid='mock-add-list-field-dialog' />,
}));

const getAllElements = () => {
  const card = page.getByRole('article').filter({ hasText: /test card/i });
  const dialog = page.getByRole('dialog', { name: /update list/i });
  const checkboxInputGroup = dialog.getByRole('listitem').nth(0);

  return {
    card,
    dialogButton: page.getByRole('button', {
      name: /update list 1 of test card/i,
    }),
    heading: page.getByRole('heading', {
      level: 2,
      name: /update list/i,
    }),
    checkboxInput: checkboxInputGroup.getByRole('checkbox'),
    checkboxTitleInput: checkboxInputGroup.getByPlaceholder('checklist'),
    textInput: dialog.getByLabelText(/note/i),
    numberInput: dialog.getByLabelText(/estimate/i),
    saveButton: page.getByRole('button', { name: /save/i }),
  };
};

beforeEach(() => {
  vi.mocked(listActions.updateList).mockResolvedValue(UPDATE_LIST_SUCCESS);
});

describe('Update dialogs', () => {
  it('renders the updated list after successful submission', async () => {
    renderBoard([successMock]);

    const {
      card,
      dialogButton,
      heading,
      checkboxInput,
      checkboxTitleInput,
      textInput,
      numberInput,
      saveButton,
    } = getAllElements();

    await expect.element(card).toBeVisible();

    await userEvent.click(dialogButton);
    await expect.element(heading).toBeVisible();

    // Update checkbox, text and number
    await checkboxTitleInput.fill('Morning coffee');
    await checkboxInput.click();
    await textInput.fill('Read Clean Code');
    await numberInput.fill('4');
    await saveButton.click();

    // Expect updated value to be displayed
    await expect
      .element(
        card.getByRole('checkbox', {
          name: /morning coffee/i,
        }),
      )
      .toBeChecked();
    await expect
      .element(card.getByText('Read Clean Code', { exact: true }))
      .toBeVisible();
    await expect.element(card.getByText('4.00', { exact: true })).toBeVisible();

    // Expect old values which be updated not to be displayed
    await expect
      .element(card.getByRole('checkbox', { name: /mark as done/i }))
      .not.toBeInTheDocument();
    await expect
      .element(
        card.getByText('Start with Atomic Habits', {
          exact: true,
        }),
      )
      .not.toBeInTheDocument();
    await expect
      .element(card.getByText('8.00', { exact: true }))
      .not.toBeInTheDocument();

    // Expect values which not be touched display the initial values
    await expect
      .element(
        card.getByText(formatDate('2026-04-10T17:00:00Z', false), {
          exact: true,
        }),
      )
      .toBeVisible();
    await expect
      .element(card.getByText('groceries', { exact: true }))
      .toBeVisible();
    await expect
      .element(card.getByText('errands', { exact: true }))
      .toBeVisible();
    await expect
      .element(card.getByRole('img', { name: mockImageUrl }))
      .toBeVisible();
    await expect.element(card.getByText('hrs', { exact: true })).toBeVisible();
  });
});
