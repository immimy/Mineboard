import {
  getAllElements,
  renderListFieldForm,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { page } from 'vitest/browser';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

describe('List field form type changes', () => {
  it('changes field type and resets type-specific config', async () => {
    await renderListFieldForm();

    const {
      addFieldButton,
      fieldActionButton,
      titleInput,
      unitLabelInput,
      unitSwitch,
    } = getAllElements();
    const dateFieldTypeMenuItem = page.getByRole('menuitem', {
      name: /^date$/i,
    });
    const timeSwitch = page.getByRole('switch', { name: /^time$/i });
    const dateFieldHeading = page.getByRole('heading', { name: /^date$/i });

    await addFieldButton.number.click();
    await titleInput.number.fill('Estimate');
    await unitSwitch.click();
    await unitLabelInput.fill('hours');

    await fieldActionButton.number.changeType.click();
    await dateFieldTypeMenuItem.click();

    await expect.element(titleInput.number).not.toBeInTheDocument();
    await expect.element(unitLabelInput).not.toBeInTheDocument();
    await expect.element(titleInput.date).toHaveValue('');
    await expect.element(timeSwitch).toHaveAttribute('aria-checked', 'false');
    await expect.element(dateFieldHeading).toBeVisible();
  });
});
