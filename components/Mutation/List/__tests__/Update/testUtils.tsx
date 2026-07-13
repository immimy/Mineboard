import {
  mockBoardId,
  mockListFields,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import BoardContextProvider from '@/components/BoardPage/BoardContext';
import DialogsProvider from '@/components/Mutation/Context/DialogsProvider';
import { useUpdateListDialogActions } from '@/components/Mutation/Context/UpdateListDialogContext';
import type { UpdateListInput } from '@/components/Mutation/Context/types';
import { MockedProvider } from '@apollo/client/testing/react';
import { ListFieldsCollectionFragment } from '@/gql/__generated__/graphql';
import { InMemoryCache } from '@apollo/client';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import UpdateListDialog from '../../UpdateListDialog';
import { initialUpdateListInput } from './testMocks';

export const getAllElements = () => {
  const inputs = page.getByRole('listitem');

  return {
    openButton: page.getByRole('button', {
      name: /open update list dialog/i,
    }),
    header: page.getByRole('heading', { level: 2, name: /update list/i }),
    cancelButton: page.getByRole('button', { name: /cancel/i }),
    saveButton: page.getByRole('button', { name: /save/i }),
    checkboxList: inputs.nth(0),
    dateList: inputs.nth(1),
    textList: inputs.nth(2),
    tagList: inputs.nth(3),
    imageList: inputs.nth(4),
    numberList: inputs.nth(5),
    textInput: page.getByLabelText(/note/i),
    numberInput: page.getByLabelText(/estimate/i),
  };
};

export const openUpdateListDialog = async () => {
  const { openButton } = getAllElements();
  await openButton.click();
};

type RenderOptions = {
  cache?: InMemoryCache;
  initialInput?: UpdateListInput;
};

export function renderUpdateListDialog({
  cache,
  initialInput = initialUpdateListInput,
}: RenderOptions = {}) {
  return render(
    <MockedProvider cache={cache}>
      <BoardContextProvider
        boardId={mockBoardId}
        queryListFields={
          mockListFields as {
            ' $fragmentRefs'?: {
              ListFieldsCollectionFragment: ListFieldsCollectionFragment;
            };
          }
        }
      >
        <DialogsProvider>
          <UpdateListButton input={initialInput} />
          <UpdateListDialog />
        </DialogsProvider>
      </BoardContextProvider>
    </MockedProvider>,
  );
}

function UpdateListButton({ input }: { input: UpdateListInput }) {
  const { openUpdateList } = useUpdateListDialogActions();

  return (
    <button type='button' onClick={() => openUpdateList(input)}>
      Open update list dialog
    </button>
  );
}
