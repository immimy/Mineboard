import { mockBoardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import {
  getAllElements,
  renderListFieldDialog,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import {
  cachedListFieldsVariables,
  CREATE_LIST_FIELDS_SUCCESS,
} from './testMocks';
import {
  CachedListFieldsDocument,
  Field_Type,
} from '@/gql/__generated__/graphql';
import * as boardActions from '@/utils/actions/board';
import { InMemoryCache } from '@apollo/client';
import { page } from 'vitest/browser';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(boardActions.createListFields).mockResolvedValue(
    CREATE_LIST_FIELDS_SUCCESS,
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('List field dialog — create flow', () => {
  it('creates list fields, updates Apollo cache, and closes the dialog', async () => {
    const cache = new InMemoryCache();

    await renderListFieldDialog({ cache });

    const {
      addFieldButton,
      dialog,
      openDialogButton,
      previewCardTitle,
      saveButton,
      titleInput,
    } = getAllElements();

    await openDialogButton.click();
    await addFieldButton.text.click();
    await titleInput.text.fill('Note');

    await expect.element(previewCardTitle).toBeVisible();

    await saveButton.click();

    await vi.waitFor(() => {
      expect(boardActions.createListFields).toHaveBeenCalledWith(mockBoardId, [
        expect.objectContaining({
          type: Field_Type.Text,
          position: 0,
          config: { title: 'Note' },
        }),
      ]);
    });

    await vi.waitFor(() => {
      expect(
        cache.readQuery({
          query: CachedListFieldsDocument,
          variables: cachedListFieldsVariables,
        }),
      ).toEqual(CREATE_LIST_FIELDS_SUCCESS.data);
    });

    await expect.element(dialog).not.toBeInTheDocument();
    await expect
      .element(page.getByText(/preview card/i))
      .not.toBeInTheDocument();
  });
});
