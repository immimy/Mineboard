import { mockBoardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import {
  CREATE_LIST_FIELDS_FAIL,
  getAllElements,
  renderAddListFieldsForm,
} from '@/components/Mutation/Board/Create/__tests__/AddListFieldsForm/testUtils';
import { Field_Type } from '@/gql/__generated__/graphql';
import * as boardActions from '@/utils/actions/board';
import { page } from 'vitest/browser';

vi.mock('@/utils/actions/board', () => ({ createListFields: vi.fn() }));

beforeEach(() => {
  vi.mocked(boardActions.createListFields).mockResolvedValue(
    CREATE_LIST_FIELDS_FAIL,
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('Add list fields submit values', () => {
  it('submits the configured field values', async () => {
    await renderAddListFieldsForm();

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
