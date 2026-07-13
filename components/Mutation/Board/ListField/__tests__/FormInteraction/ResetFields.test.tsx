import { mockTextId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
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

describe('List field form reset', () => {
  it('resets create-mode fields back to an empty initial form', async () => {
    await renderListFieldDialog();

    const {
      addFieldButton,
      openDialogButton,
      resetButton,
      saveButton,
      titleInput,
    } = getAllElements();
    const emptyFieldsMessage = /add a field to start building the list layout/i;

    await openDialogButton.click();

    await expect.element(resetButton).toBeDisabled();

    await addFieldButton.text.click();
    await titleInput.text.fill('Note');

    await expect.element(resetButton).toBeEnabled();

    await resetButton.click();

    await expect.element(titleInput.text).not.toBeInTheDocument();
    await expect.element(saveButton).not.toBeInTheDocument();
    await expect.element(resetButton).toBeDisabled();
    await expect.element(page.getByText(emptyFieldsMessage)).toBeVisible();
  });

  it('resets update-mode edits back to the initial database fields', async () => {
    await renderListFieldDialog({ queryListFields: existingTextField });

    const {
      alert,
      fieldActionButton,
      openDialogButton,
      resetButton,
      titleInput,
    } = getAllElements();

    await openDialogButton.click();

    await expect.element(resetButton).toBeDisabled();
    await expect.element(titleInput.text).toHaveValue('Note');

    await titleInput.text.fill('Edited note');

    await expect.element(resetButton).toBeEnabled();

    await resetButton.click();

    await expect.element(titleInput.text).toHaveValue('Note');
    await expect.element(resetButton).toBeDisabled();

    await fieldActionButton.text.remove.click();
    await alert.continueButton.click();

    await expect.element(titleInput.text).not.toBeInTheDocument();
    await expect.element(resetButton).toBeEnabled();

    await resetButton.click();

    await expect.element(titleInput.text).toHaveValue('Note');
    await expect.element(resetButton).toBeDisabled();
  });
});
