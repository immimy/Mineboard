import {
  getAllElements,
  renderListFieldForm,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { page } from 'vitest/browser';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

describe('List field form removal', () => {
  it('removes the selected field without removing sibling fields', async () => {
    await renderListFieldForm();

    const { addFieldButton, fieldActionButton, saveButton, titleInput } =
      getAllElements();
    const emptyFieldsMessage = page.getByText(
      /add a field to start building the list layout/i,
    );

    await addFieldButton.text.click();
    await addFieldButton.date.click();
    await titleInput.date.fill('Deadline');

    await fieldActionButton.text.remove.click();

    await expect.element(titleInput.text).not.toBeInTheDocument();
    await expect.element(titleInput.date).toHaveValue('Deadline');
    await expect.element(saveButton).toBeVisible();

    await fieldActionButton.date.remove.click();

    await expect.element(emptyFieldsMessage).toBeVisible();
    await expect.element(saveButton).not.toBeInTheDocument();
  });
});
