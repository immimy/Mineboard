import * as boardActions from '@/utils/actions/board';
import { page, userEvent } from 'vitest/browser';
import {
  boardWithThreeListFieldsMock,
  UPDATE_LIST_FIELDS_SUCCESS,
} from './testMocks';
import {
  getAllElements,
  openListFieldsFromActionMenu,
  renderBoard,
} from './testUtils';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));
vi.mock('@/utils/actions/card');
vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

beforeEach(() => {
  vi.mocked(boardActions.updateListFields).mockResolvedValue(
    UPDATE_LIST_FIELDS_SUCCESS,
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('Update list fields full flow', () => {
  it('updates field configuration, removes a field, changes a field type, and adds a field', async () => {
    // Arrange: render a board that starts with date, text, and tag fields.
    await renderBoard([boardWithThreeListFieldsMock]);

    const { addListButton, saveButton } = getAllElements();
    const lists = page
      .getByRole('listitem')
      .filter({ has: page.getByRole('list') });
    const existingList = lists.nth(0);

    await openListFieldsFromActionMenu();

    // Act: remove the existing tag field and confirm the destructive change.
    await page.getByRole('button', { name: /remove tag field/i }).click();
    await page.getByRole('button', { name: /^continue$/i }).click();

    // Act: change the existing date field into a checkbox field.
    await page.getByRole('button', { name: /change date field type/i }).click();
    await page.getByRole('menuitem', { name: /^checkbox$/i }).click();
    await page.getByRole('button', { name: /^continue$/i }).click();

    // Act: update the existing text field config.
    await page.getByPlaceholder('Text Title (optional)').fill('Summary');

    // Act: add a new number field.
    await page.getByRole('button', { name: /^number$/i }).click();
    await page.getByPlaceholder('Number Title (optional)').fill('Estimate');
    await userEvent.click(saveButton);

    // Assert: the dialog submits through the update action, not the create action.
    await vi.waitFor(() => {
      expect(boardActions.updateListFields).toHaveBeenCalledOnce();
    });
    expect(boardActions.createListFields).not.toHaveBeenCalled();

    // Assert: the existing list renders only the refreshed server values.
    await expect
      .element(existingList.getByRole('heading', { name: 'Summary' }))
      .toBeVisible();
    await expect
      .element(existingList.getByText('Start with Atomic Habits'))
      .toBeVisible();
    await expect
      .element(existingList.getByRole('heading', { name: 'Note' }))
      .not.toBeInTheDocument();
    await expect
      .element(existingList.getByRole('heading', { name: 'Deadline' }))
      .not.toBeInTheDocument();
    await expect
      .element(existingList.getByText('reading'))
      .not.toBeInTheDocument();
    await expect
      .element(existingList.getByText('research'))
      .not.toBeInTheDocument();
    await expect
      .element(existingList.getByText(/apr/i))
      .not.toBeInTheDocument();

    // Assert: new-list creation uses the latest field definitions after update.
    await userEvent.click(addListButton);

    await expect.element(page.getByLabelText('Summary')).toBeVisible();
    await expect.element(page.getByRole('spinbutton')).toBeVisible();
    await expect.element(page.getByPlaceholder('checklist')).toBeVisible();
    await expect
      .element(page.getByLabelText(/^note$/i))
      .not.toBeInTheDocument();
    await expect
      .element(page.getByLabelText(/^deadline$/i))
      .not.toBeInTheDocument();
    await expect
      .element(page.getByPlaceholder('Add tag...'))
      .not.toBeInTheDocument();
  });
});
