import { mockBoardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import {
  getAllElements,
  renderListFieldForm,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { Field_Type } from '@/gql/__generated__/graphql';
import * as boardActions from '@/utils/actions/board';
import { CREATE_LIST_FIELDS_FAIL } from './testMocks';
import { page } from 'vitest/browser';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(boardActions.createListFields).mockResolvedValue(
    CREATE_LIST_FIELDS_FAIL,
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('Add List field — form submit values', () => {
  it('submits the configured field values', async () => {
    await renderListFieldForm();

    const {
      addFieldButton,
      saveButton,
      titleInput,
      unitLabelInput,
      unitSwitch,
    } = getAllElements();
    const backPositionRadio = page.getByRole('radio', { name: /^back$/i });

    await addFieldButton.number.click();
    await titleInput.number.fill('Estimate');
    await unitSwitch.click();
    await unitLabelInput.fill('hours');
    await backPositionRadio.click();
    await saveButton.click();

    await vi.waitFor(() => {
      expect(boardActions.createListFields).toHaveBeenCalledWith(mockBoardId, [
        expect.objectContaining({
          type: Field_Type.Number,
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
});
