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

describe('List field submission — position ordering', () => {
  it('sends positions that match the submitted array order after removal and add', async () => {
    await renderListFieldForm();

    const { addFieldButton } = getAllElements();

    await addFieldButton.number.click();
    await addFieldButton.text.click();

    await page.getByRole('button', { name: /remove number field/i }).click();
    await addFieldButton.tag.click();

    const submittedFields = await submitListFields();

    expect(submittedFields).toEqual([
      expect.objectContaining({
        type: Field_Type.Text,
        position: 0,
      }),
      expect.objectContaining({
        type: Field_Type.Tag,
        position: 1,
      }),
    ]);
  });
});
