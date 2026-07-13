import { mockBoardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { getAllElements } from '@/components/Mutation/Board/ListField/__tests__/testUtils';
import { ListFieldForm } from '@/types/app';
import * as boardActions from '@/utils/actions/board';
import {
  UPDATE_LIST_FIELDS_FAIL,
  UPDATE_LIST_FIELDS_SUCCESS,
} from './testMocks';

export function mockUpdateListFieldsSuccess() {
  vi.mocked(boardActions.updateListFields).mockResolvedValue(
    UPDATE_LIST_FIELDS_SUCCESS,
  );
}

export function mockUpdateListFieldsFailure() {
  vi.mocked(boardActions.updateListFields).mockResolvedValue(
    UPDATE_LIST_FIELDS_FAIL,
  );
}

export async function submitUpdatedListFields() {
  await getAllElements().saveButton.click();

  await vi.waitFor(() => {
    expect(boardActions.updateListFields).toHaveBeenCalledTimes(1);
  });

  const [boardId, submittedFields] = vi.mocked(boardActions.updateListFields)
    .mock.calls[0];

  expect(boardId).toBe(mockBoardId);
  expect(boardActions.createListFields).not.toHaveBeenCalled();

  return submittedFields as ListFieldForm[];
}
