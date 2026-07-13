import {
  getAllElements,
  renderListFieldForm,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { Field_Type } from '@/gql/__generated__/graphql';
import { page } from 'vitest/browser';
import { mockCreateListFieldsFailure, submitListFields } from './testUtils';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

beforeEach(() => {
  mockCreateListFieldsFailure();
});

describe('List field submission — number field', () => {
  it('sends the number field to the action in the correct format', async () => {
    await renderListFieldForm();

    const { addFieldButton, titleInput, unitLabelInput, unitSwitch } =
      getAllElements();

    await addFieldButton.number.click();
    await titleInput.number.fill('Estimate');
    await unitSwitch.click();
    await unitLabelInput.fill('hours');
    await page.getByRole('radio', { name: /^back$/i }).click();

    const submittedFields = await submitListFields();

    expect(submittedFields).toEqual([
      expect.objectContaining({
        type: Field_Type.Number,
        position: 0,
        config: {
          title: 'Estimate',
          isHasUnit: true,
          unit: 'hours',
          unitPosition: 'back',
        },
      }),
    ]);
  });
});
