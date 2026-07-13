import {
  getAllElements,
  renderListFieldForm,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { Field_Type } from '@/gql/__generated__/graphql';
import { ColorPalette } from '@/types/jsonbSchema';
import { page } from 'vitest/browser';
import { mockCreateListFieldsFailure, submitListFields } from './testUtils';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

beforeEach(() => {
  mockCreateListFieldsFailure();
});

describe('List field submission — tag field', () => {
  it('sends the tag field to the action in the correct format', async () => {
    await renderListFieldForm();

    await getAllElements().addFieldButton.tag.click();
    await page.getByRole('radio', { name: /^palette 5$/i }).click();

    const submittedFields = await submitListFields();

    expect(submittedFields).toEqual([
      expect.objectContaining({
        type: Field_Type.Tag,
        position: 0,
        config: { color: ColorPalette.fifth },
      }),
    ]);
  });
});
