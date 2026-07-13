import {
  getAllElements,
  renderListFieldForm,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { page } from 'vitest/browser';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

describe('List field form details disclosure', () => {
  it('collapses and expands field details while keeping draft values', async () => {
    await renderListFieldForm();

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
