import { mockBoardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import {
  getAllElements,
  renderListFieldDialog,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import {
  cachedListFieldsVariables,
  existingTextDateListFields,
  UPDATE_LIST_FIELDS_SUCCESS,
} from './testMocks';
import {
  CachedListFieldsDocument,
  Field_Type,
} from '@/gql/__generated__/graphql';
import * as boardActions from '@/utils/actions/board';
import { InMemoryCache } from '@apollo/client';
import { page } from 'vitest/browser';
import { mockUpdateListFieldsSuccess } from './testUtils';

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

describe('List field dialog — update flow', () => {
  it('updates list fields, writes the returned fields to cache, and closes the dialog', async () => {
    const cache = new InMemoryCache();

    await renderListFieldDialog({
      cache,
      queryListFields:
        existingTextDateListFields as RenderListFieldDialogOptions['queryListFields'],
    });

    const { dialog, openDialogButton, saveButton, titleInput } =
      getAllElements();

    await openDialogButton.click();
    await titleInput.text.fill('Edited note');
    await saveButton.click();

    await vi.waitFor(() => {
      expect(boardActions.updateListFields).toHaveBeenCalledWith(mockBoardId, [
        expect.objectContaining({
          type: Field_Type.Text,
          position: 0,
          config: { title: 'Edited note' },
        }),
        expect.objectContaining({
          type: Field_Type.Date,
          position: 1,
          config: { title: 'Deadline', isIncludeTime: false },
        }),
      ]);
    });

    await vi.waitFor(() => {
      expect(
        cache.readQuery({
          query: CachedListFieldsDocument,
          variables: cachedListFieldsVariables,
        }),
      ).toEqual(UPDATE_LIST_FIELDS_SUCCESS.data.listFields);
    });

    await expect.element(dialog).not.toBeInTheDocument();
    await expect
      .element(page.getByText(/preview card/i))
      .not.toBeInTheDocument();
  });
});
