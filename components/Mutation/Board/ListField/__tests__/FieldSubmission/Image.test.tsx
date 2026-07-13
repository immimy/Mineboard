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

describe('List field submission — image field', () => {
  it('sends the image field to the action in the correct format', async () => {
    await renderListFieldForm();

    const { addFieldButton, titleInput } = getAllElements();

    await addFieldButton.image.click();
    await titleInput.image.fill('Cover');

    const submittedFields = await submitListFields();

    expect(submittedFields).toEqual([
      expect.objectContaining({
        type: Field_Type.Image,
        position: 0,
        config: { title: 'Cover' },
      }),
    ]);
  });
});
