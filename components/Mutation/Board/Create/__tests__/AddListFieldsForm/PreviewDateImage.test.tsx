import {
  getAllElements,
  renderAddListFieldsForm,
} from '@/components/Mutation/Board/Create/__tests__/AddListFieldsForm/testUtils';
import { page } from 'vitest/browser';

vi.mock('@/utils/actions/board', () => ({ createListFields: vi.fn() }));

describe('Add list fields date and image preview', () => {
  it('shows the date field title and formatted example date', async () => {
    await renderAddListFieldsForm();

    const { addFieldButton, previewCardTitle, titleInput } = getAllElements();
    const deadlineTitle = page.getByText(/deadline/i);
    const datePreviewValue = page.getByText('25 Dec 2025');

    await addFieldButton.date.click();
    await titleInput.date.fill('Deadline');

    await expect.element(previewCardTitle).toBeVisible();
    await expect.element(deadlineTitle).toBeVisible();
    await expect.element(datePreviewValue).toBeVisible();
  });

  it('shows the image field title and placeholder image', async () => {
    await renderAddListFieldsForm();

    const { addFieldButton, previewCardTitle, titleInput } = getAllElements();
    const coverHeading = page.getByRole('heading', { name: 'Cover' });
    const imagePlaceholder = page.getByRole('img', {
      name: /cover placeholder/i,
    });

    await addFieldButton.image.click();
    await titleInput.image.fill('Cover');

    await expect.element(previewCardTitle).toBeVisible();
    await expect.element(coverHeading).toBeVisible();
    await expect.element(imagePlaceholder).toBeVisible();
  });
});
