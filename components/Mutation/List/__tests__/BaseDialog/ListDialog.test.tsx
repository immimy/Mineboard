import {
  mockCheckboxId,
  mockDateId,
  mockNumberId,
  mockTagId,
  mockTextId,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { Field_Type } from '@/gql/__generated__/graphql';
import { ColorPalette } from '@/types/jsonbSchema';
import { page } from 'vitest/browser';
import { initFormState } from '../../utils';
import { getAllElements, listFields, renderListDialog } from './testUtils';

describe('ListDialog base UI', () => {
  it('renders the list form dialog correctly', async () => {
    renderListDialog({ initialOpen: true });

    const {
      header,
      description,
      checkboxTitleInput,
      dateInput,
      textInput,
      tagInput,
      imageButton,
      numberInput,
      saveButton,
      cancelButton,
    } = getAllElements();

    // Dialog Header
    await expect.element(header).toBeVisible();
    await expect.element(description).toBeVisible();

    // Form Inputs
    await expect.element(checkboxTitleInput).toBeVisible();
    await expect.element(dateInput).toBeVisible();
    await expect.element(textInput).toBeVisible();
    await expect.element(tagInput).toBeVisible();
    await expect.element(imageButton).toBeVisible();
    await expect.element(numberInput).toBeVisible();

    // Buttons
    await expect.element(cancelButton).toBeVisible();
    await expect.element(saveButton).toBeVisible();
  });

  it('renders the inputs from the provided form state', async () => {
    renderListDialog({
      initialOpen: true,
      initialForm: {
        ...initFormState(listFields),
        [mockCheckboxId]: {
          type: Field_Type.Checkbox,
          value: { checked: true, title: 'Existing checklist item' },
        },
        [mockDateId]: {
          type: Field_Type.Date,
          value: '2026-04-10',
        },
        [mockTextId]: {
          type: Field_Type.Text,
          value: 'Existing note',
        },
        [mockTagId]: {
          type: Field_Type.Tag,
          value: [{ tag: 'existing tag', color: ColorPalette.third }],
        },
        [mockNumberId]: {
          type: Field_Type.Number,
          value: '13',
        },
      },
    });

    const { checkboxTitleInput, dateInput, textInput, numberInput } =
      getAllElements();
    const checkboxInput = page.getByRole('checkbox');
    const existingTag = page.getByRole('button', { name: /existing tag/i });

    await expect.element(checkboxInput).toBeChecked();
    await expect
      .element(checkboxTitleInput)
      .toHaveValue('Existing checklist item');
    await expect.element(dateInput).toHaveValue('2026-04-10');
    await expect.element(textInput).toHaveValue('Existing note');
    await expect.element(existingTag).toBeVisible();
    await expect.element(numberInput).toHaveValue(13);
  });

  it('opens and closes from the controlled dialog state', async () => {
    renderListDialog();

    const { header, cancelButton, saveButton, openButton } = getAllElements();

    expect(header.query()).toBe(null);

    await openButton.click();

    await expect.element(header).toBeVisible();
    await expect.element(cancelButton).toBeVisible();
    await expect.element(saveButton).toBeVisible();

    await cancelButton.click();

    expect(header.query()).toBe(null);
    expect(cancelButton.query()).toBe(null);
    expect(saveButton.query()).toBe(null);
  });
});
