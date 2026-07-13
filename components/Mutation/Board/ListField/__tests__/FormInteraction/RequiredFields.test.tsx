import { mockDateId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import {
  getAllElements,
  renderListFieldDialog,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { CachedListFieldsQuery, Field_Type } from '@/gql/__generated__/graphql';
import * as boardActions from '@/utils/actions/board';
import { page } from 'vitest/browser';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

type RenderListFieldDialogOptions = NonNullable<
  Parameters<typeof renderListFieldDialog>[0]
>;

const singleExistingDateField = {
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
} satisfies NonNullable<CachedListFieldsQuery['list_fieldsCollection']>;

describe('List field dialog — create/update required fields', () => {
  it('does not expose save or call an action after every existing field is removed', async () => {
    await renderListFieldDialog({
      queryListFields:
        singleExistingDateField as RenderListFieldDialogOptions['queryListFields'],
    });

    const { alert, fieldActionButton, openDialogButton, saveButton } =
      getAllElements();
    const emptyFieldsMessage = page.getByText(
      /add a field to start building the list layout/i,
    );

    await openDialogButton.click();
    await fieldActionButton.date.remove.click();
    await alert.continueButton.click();

    await expect.element(emptyFieldsMessage).toBeVisible();
    await expect.element(saveButton).not.toBeInTheDocument();
    expect(boardActions.updateListFields).not.toHaveBeenCalled();
    expect(boardActions.createListFields).not.toHaveBeenCalled();
  });
});
