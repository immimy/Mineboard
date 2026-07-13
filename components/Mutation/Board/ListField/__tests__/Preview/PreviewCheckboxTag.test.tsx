import {
  getAllElements,
  renderListFieldForm,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { page } from 'vitest/browser';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

describe('List field preview for checkbox and tag fields', () => {
  it('shows the checkbox checklist preview', async () => {
    await renderListFieldForm();

    const { addFieldButton, previewCardTitle } = getAllElements();
    const checklistValue = page.getByText('checklist');

    await addFieldButton.checkbox.click();

    await expect.element(previewCardTitle).toBeVisible();
    await expect.element(checklistValue).toBeVisible();
  });

  it('shows the tag preview', async () => {
    await renderListFieldForm();

    const { addFieldButton, previewCardTitle } = getAllElements();
    const tagValue = page.getByText('example');

    await addFieldButton.tag.click();

    await expect.element(previewCardTitle).toBeVisible();
    await expect.element(tagValue).toBeVisible();
  });
});
