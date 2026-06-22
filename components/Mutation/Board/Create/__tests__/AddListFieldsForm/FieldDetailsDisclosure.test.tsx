import {
  getAllElements,
  renderAddListFieldsForm,
} from '@/components/Mutation/Board/Create/__tests__/AddListFieldsForm/testUtils';
import { page } from 'vitest/browser';

vi.mock('@/utils/actions/board', () => ({ createListFields: vi.fn() }));

describe('Add list fields details disclosure', () => {
  it('collapses and expands field details while keeping draft values', async () => {
    await renderAddListFieldsForm();

    const { addFieldButton, titleInput } = getAllElements();
    const collapseNumberDetailsButton = page.getByRole('button', {
      name: /collapse number field details/i,
    });
    const expandNumberDetailsButton = page.getByRole('button', {
      name: /expand number field details/i,
    });

    await addFieldButton.number.click();
    await titleInput.number.fill('Estimate');

    await collapseNumberDetailsButton.click();

    await expect.element(titleInput.number).not.toBeInTheDocument();
    await expect.element(expandNumberDetailsButton).toBeVisible();

    await expandNumberDetailsButton.click();

    await expect.element(titleInput.number).toHaveValue('Estimate');
  });
});
