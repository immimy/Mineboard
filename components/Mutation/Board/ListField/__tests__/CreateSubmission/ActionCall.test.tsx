import {
  getAllElements,
  renderListFieldDialog,
} from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import * as boardActions from '@/utils/actions/board';
import { toast } from 'react-toastify';
import { CREATE_LIST_FIELDS_SUCCESS } from './testMocks';

vi.mock('@/utils/actions/board', () => ({
  createListFields: vi.fn(),
  updateListFields: vi.fn(),
}));

type RenderListFieldDialogOptions = NonNullable<
  Parameters<typeof renderListFieldDialog>[0]
>;

const emptyListFields = {
  __typename: 'list_fieldsConnection',
  edges: [],
} as RenderListFieldDialogOptions['queryListFields'];

beforeEach(() => {
  vi.mocked(boardActions.createListFields).mockResolvedValue(
    CREATE_LIST_FIELDS_SUCCESS,
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('List field dialog — create action call', () => {
  it('calls createListFields when the board has no list fields', async () => {
    await renderListFieldDialog({ queryListFields: emptyListFields });

    const { addFieldButton, openDialogButton, saveButton } = getAllElements();

    await openDialogButton.click();
    await addFieldButton.text.click();
    await saveButton.click();

    await vi.waitFor(() => {
      expect(boardActions.createListFields).toHaveBeenCalledOnce();
    });
    expect(boardActions.updateListFields).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });
});
