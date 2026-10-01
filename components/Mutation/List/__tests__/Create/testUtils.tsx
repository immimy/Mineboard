import IdleLayoutSyncProvider from '@/mocks/browser/components/IdleLayoutSyncProvider';
import {
  mockBoardId,
  mockCardId,
  mockListFields,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import BoardContextProvider from '@/components/BoardPage/Board/BoardContext';
import DialogsProvider from '@/components/Mutation/Context/DialogsProvider';
import { ListFieldsCollectionFragment } from '@/gql/__generated__/graphql';
import { MockedProvider } from '@apollo/client/testing/react';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import AddListOpenButton from '@/components/Mutation/List/AddListOpenButton';
import AddListDialog from '@/components/Mutation/List/AddListDialog';
import { ApolloCache } from '@apollo/client';

export const getAllElements = () => {
  const inputs = page.getByRole('listitem');
  return {
    addListDialogButton: page.getByRole('button', { name: /add list/i }),
    header: page.getByRole('heading', { level: 2, name: /create list/i }),
    cancelButton: page.getByRole('button', { name: /cancel/i }),
    saveButton: page.getByRole('button', { name: /save/i }),
    checkboxList: inputs.nth(0),
    dateList: inputs.nth(1),
    textList: inputs.nth(2),
    tagList: inputs.nth(3),
    imageList: inputs.nth(4),
    numberList: inputs.nth(5),
  };
};

export const openAddListDialog = async () => {
  const { addListDialogButton } = getAllElements();
  await addListDialogButton.click();
};

export const renderAddListDialog = (cache?: ApolloCache) => {
  return render(
    <IdleLayoutSyncProvider boardId={mockBoardId}>
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
            <AddListOpenButton cardId={mockCardId} />
            <AddListDialog />
          </DialogsProvider>
        </BoardContextProvider>
      </MockedProvider>
    </IdleLayoutSyncProvider>,
  );
};
