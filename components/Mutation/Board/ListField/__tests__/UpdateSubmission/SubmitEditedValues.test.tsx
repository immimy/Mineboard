import {
  mockDateId,
  mockTextId,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import {
  getAllElements,
  renderListFieldDialog,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { existingTextDateListFields } from './testMocks';
import { Field_Type } from '@/gql/__generated__/graphql';
import { ColorPalette } from '@/types/jsonbSchema';
import { page } from 'vitest/browser';
import {
  mockUpdateListFieldsSuccess,
  submitUpdatedListFields,
} from './testUtils';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

type RenderListFieldDialogOptions = NonNullable<
  Parameters<typeof renderListFieldDialog>[0]
>;

beforeEach(() => {
  mockUpdateListFieldsSuccess();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('Update List field dialog — update submit values', () => {
  it('submits edited existing fields, excludes removed fields, and includes new client fields in array order', async () => {
    await renderListFieldDialog({
      queryListFields:
        existingTextDateListFields as RenderListFieldDialogOptions['queryListFields'],
    });

    const {
      addFieldButton,
      alert,
      fieldActionButton,
      openDialogButton,
      titleInput,
      unitLabelInput,
      unitSwitch,
    } = getAllElements();
    const numberFieldTypeMenuItem = page.getByRole('menuitem', {
      name: /^number$/i,
    });
    const backPositionRadio = page.getByRole('radio', { name: /^back$/i });

    await openDialogButton.click();

    await fieldActionButton.text.changeType.click();
    await numberFieldTypeMenuItem.click();
    await alert.continueButton.click();
    await titleInput.number.fill('Estimate');
    await unitSwitch.click();
    await unitLabelInput.fill('hours');
    await backPositionRadio.click();

    await fieldActionButton.date.remove.click();
    await alert.continueButton.click();

    await addFieldButton.tag.click();

    const submittedFields = await submitUpdatedListFields();

    expect(submittedFields).toEqual([
      expect.objectContaining({
        id: mockTextId,
        type: Field_Type.Number,
        position: 0,
        config: {
          title: 'Estimate',
          isHasUnit: true,
          unit: 'hours',
          unitPosition: 'back',
        },
      }),
      expect.objectContaining({
        id: expect.stringMatching(/^client:/),
        type: Field_Type.Tag,
        position: 1,
        config: { color: ColorPalette.first },
      }),
    ]);

    expect(submittedFields).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: mockDateId,
        }),
      ]),
    );
    expect(submittedFields).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: mockTextId,
          type: Field_Type.Text,
          config: { title: 'Note' },
        }),
      ]),
    );
  });
});
