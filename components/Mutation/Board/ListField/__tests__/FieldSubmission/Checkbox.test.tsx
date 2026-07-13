import {
  getAllElements,
  renderListFieldForm,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { Field_Type } from '@/gql/__generated__/graphql';
import { mockCreateListFieldsFailure, submitListFields } from './testUtils';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

beforeEach(() => {
  mockCreateListFieldsFailure();
});

describe('List field submission — checkbox field', () => {
  it('sends the checkbox field to the action in the correct format', async () => {
    await renderListFieldForm();

    await getAllElements().addFieldButton.checkbox.click();

    const submittedFields = await submitListFields();

    expect(submittedFields).toEqual([
      expect.objectContaining({
        type: Field_Type.Checkbox,
        position: 0,
        config: {},
      }),
    ]);
  });
});
