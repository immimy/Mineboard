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

describe('List field submission — date field', () => {
  it('sends the date field to the action in the correct format', async () => {
    await renderListFieldForm();

    const { addFieldButton, titleInput } = getAllElements();

    await addFieldButton.date.click();
    await titleInput.date.fill('Deadline');
    await page.getByRole('switch', { name: /^time$/i }).click();

    const submittedFields = await submitListFields();

    expect(submittedFields).toEqual([
      expect.objectContaining({
        type: Field_Type.Date,
        position: 0,
        config: {
          title: 'Deadline',
          isIncludeTime: true,
        },
      }),
    ]);
  });
});
