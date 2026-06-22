import {
  getAllElements,
  renderAddListFieldsForm,
} from '@/components/Mutation/Board/Create/__tests__/AddListFieldsForm/testUtils';
import { page } from 'vitest/browser';

vi.mock('@/utils/actions/board', () => ({ createListFields: vi.fn() }));

describe('Add list fields checkbox and tag preview', () => {
  it('shows the checkbox checklist preview', async () => {
    await renderAddListFieldsForm();

    const { addFieldButton, previewCardTitle } = getAllElements();
    const checklistValue = page.getByText('checklist');

    await addFieldButton.checkbox.click();

    await expect.element(previewCardTitle).toBeVisible();
    await expect.element(checklistValue).toBeVisible();
  });

  it('shows the tag preview', async () => {
    await renderAddListFieldsForm();

    const { addFieldButton, previewCardTitle } = getAllElements();
    const tagValue = page.getByText('example');

    await addFieldButton.tag.click();

    await expect.element(previewCardTitle).toBeVisible();
    await expect.element(tagValue).toBeVisible();
  });
});
