import {
  getAllElements,
  renderListFieldForm,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { page } from 'vitest/browser';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

describe('List field preview for text and number fields', () => {
  it('shows the text field title and example note', async () => {
    await renderListFieldForm();

    const { addFieldButton, previewCardTitle, titleInput } = getAllElements();
    const noteHeading = page.getByRole('heading', { name: 'Note' });
    const textPreviewValue = page.getByText(/short note preview/i);

    await addFieldButton.text.click();
    await titleInput.text.fill('Note');

    await expect.element(previewCardTitle).toBeVisible();
    await expect.element(noteHeading).toBeVisible();
    await expect.element(textPreviewValue).toBeVisible();
  });

  it('shows the number field title and formatted example number', async () => {
    await renderListFieldForm();

    const { addFieldButton, previewCardTitle, titleInput } = getAllElements();
    const estimateTitle = page.getByText(/estimate/i);
    const numberPreviewValue = page.getByText('100.00');

    await addFieldButton.number.click();
    await titleInput.number.fill('Estimate');

    await expect.element(previewCardTitle).toBeVisible();
    await expect.element(estimateTitle).toBeVisible();
    await expect.element(numberPreviewValue).toBeVisible();
  });
});
