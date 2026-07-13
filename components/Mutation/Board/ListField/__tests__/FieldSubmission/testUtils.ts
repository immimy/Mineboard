import { mockBoardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { getAllElements } from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { ListFieldForm } from '@/types/app';
import * as boardActions from '@/utils/actions/board';

export const CREATE_LIST_FIELDS_FAIL = {
  data: null,
  error: 'Failed to create list fields',
};

export function mockCreateListFieldsFailure() {
  vi.mocked(boardActions.createListFields).mockResolvedValue(
    CREATE_LIST_FIELDS_FAIL,
  );
}

export async function submitListFields() {
  await getAllElements().saveButton.click();

  await vi.waitFor(() => {
    expect(boardActions.createListFields).toHaveBeenCalledTimes(1);
  });

  const [boardId, submittedFields] = vi.mocked(boardActions.createListFields)
    .mock.calls[0];

  expect(boardId).toBe(mockBoardId);

  return submittedFields as ListFieldForm[];
}
