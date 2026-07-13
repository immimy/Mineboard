import { mockListFields } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import {
  getAllElements,
  renderListFieldDialog,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import {
  CachedBoardListsQuery,
  CachedListFieldsQuery,
} from '@/gql/__generated__/graphql';
import * as boardActions from '@/utils/actions/board';
import { toast } from 'react-toastify';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

type RenderListFieldDialogOptions = NonNullable<
  Parameters<typeof renderListFieldDialog>[0]
>;

const existingListFields =
  mockListFields as RenderListFieldDialogOptions['queryListFields'];

beforeEach(() => {
  vi.mocked(boardActions.updateListFields).mockResolvedValue({
    data: {
      listFields: {
        __typename: 'Query',
        list_fieldsCollection: mockListFields as NonNullable<
          CachedListFieldsQuery['list_fieldsCollection']
        >,
      },
      boardLists: {
        __typename: 'Query',
        cardsCollection: {
          __typename: 'cardsConnection',
          edges: [],
        },
      } satisfies CachedBoardListsQuery,
    },
    error: null,
  });
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('List field dialog — update action call', () => {
  it('calls updateListFields when the board already has list fields', async () => {
    await renderListFieldDialog({ queryListFields: existingListFields });

    const { openDialogButton, saveButton } = getAllElements();

    await openDialogButton.click();
    await saveButton.click();

    await vi.waitFor(() => {
      expect(boardActions.updateListFields).toHaveBeenCalledOnce();
    });
    expect(boardActions.createListFields).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });
});
