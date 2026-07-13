import {
  mockDateId,
  mockTextId,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import {
  getAllElements,
  renderListFieldDialog,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { Field_Type } from '@/gql/__generated__/graphql';
import { page } from 'vitest/browser';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

type RenderListFieldDialogOptions = NonNullable<
  Parameters<typeof renderListFieldDialog>[0]
>;

const existingTextField = {
  __typename: 'list_fieldsConnection',
  edges: [
    {
      __typename: 'list_fieldsEdge' as const,
      node: {
        __typename: 'list_fields' as const,
        id: mockTextId,
        type: Field_Type.Text,
        config: { title: 'Note' },
        position: 0,
      },
    },
  ],
} as RenderListFieldDialogOptions['queryListFields'];

const existingDateField = {
  __typename: 'list_fieldsConnection',
  edges: [
    {
      __typename: 'list_fieldsEdge' as const,
      node: {
        __typename: 'list_fields' as const,
        id: mockDateId,
        type: Field_Type.Date,
        config: { title: 'Deadline', isIncludeTime: false },
        position: 0,
      },
    },
  ],
} as RenderListFieldDialogOptions['queryListFields'];

describe('List field form destructive confirmations', () => {
  it('warns before removing an existing field and only removes it after confirmation', async () => {
    await renderListFieldDialog({ queryListFields: existingDateField });

    const { alert, fieldActionButton, openDialogButton, titleInput } =
      getAllElements();

    await openDialogButton.click();

    await expect.element(titleInput.date).toHaveValue('Deadline');

    await fieldActionButton.date.remove.click();

    await expect.element(alert.removeMessage).toBeVisible();
    await expect.element(titleInput.date).toHaveValue('Deadline');

    await alert.cancelButton.click();

    await expect.element(alert.removeMessage).not.toBeInTheDocument();
    await expect.element(titleInput.date).toHaveValue('Deadline');

    await fieldActionButton.date.remove.click();
    await alert.continueButton.click();

    await expect.element(alert.removeMessage).not.toBeInTheDocument();
    await expect.element(titleInput.date).not.toBeInTheDocument();
  });

  it('warns once before changing an existing field type away from the database type', async () => {
    await renderListFieldDialog({ queryListFields: existingTextField });

    const { alert, fieldActionButton, openDialogButton, titleInput } =
      getAllElements();
    const dateFieldTypeMenuItem = page.getByRole('menuitem', {
      name: /^date$/i,
    });
    const imageFieldTypeMenuItem = page.getByRole('menuitem', {
      name: /^image$/i,
    });

    await openDialogButton.click();

    await expect.element(titleInput.text).toHaveValue('Note');

    await fieldActionButton.text.changeType.click();
    await dateFieldTypeMenuItem.click();

    await expect.element(alert.typeChangeMessage).toBeVisible();
    await expect.element(titleInput.text).toHaveValue('Note');
    await expect.element(titleInput.date).not.toBeInTheDocument();

    await alert.cancelButton.click();

    await expect.element(alert.typeChangeMessage).not.toBeInTheDocument();
    await expect.element(titleInput.text).toHaveValue('Note');

    await fieldActionButton.text.changeType.click();
    await dateFieldTypeMenuItem.click();
    await alert.continueButton.click();

    await expect.element(alert.typeChangeMessage).not.toBeInTheDocument();
    await expect.element(titleInput.text).not.toBeInTheDocument();
    await expect.element(titleInput.date).toHaveValue('');

    await page.getByRole('button', { name: /change date field type/i }).click();
    await imageFieldTypeMenuItem.click();

    await expect.element(alert.typeChangeMessage).not.toBeInTheDocument();
    await expect.element(titleInput.date).not.toBeInTheDocument();
    await expect.element(titleInput.image).toHaveValue('');
  });
});
