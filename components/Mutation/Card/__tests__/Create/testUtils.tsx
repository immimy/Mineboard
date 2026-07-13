import {
  mockBoardId,
  mockListFields,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import AddCardActionButton from '@/components/BoardPage/ActionButtons/AddCardActionButton';
import BoardContextProvider from '@/components/BoardPage/BoardContext';
import DialogsProvider from '@/components/Mutation/Context/DialogsProvider';
import type { ListFieldsCollectionFragment } from '@/gql/__generated__/graphql';
import { MockedProvider } from '@apollo/client/testing/react';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import AddCardDialog from '../../AddCardDialog';

export const getAllElements = () => ({
  addCardDialogButton: page.getByRole('button', { name: /add new card/i }),
  header: page.getByRole('heading', { level: 2, name: /create card/i }),
  description: page.getByText(/add a new card to this board/i),
  titleInput: page.getByLabelText(/title/i),
  colorGroup: page.getByRole('radiogroup', { name: /color/i }),
  firstPalette: page.getByRole('radio', { name: /palette 1/i }),
  thirdPalette: page.getByRole('radio', { name: /palette 3/i }),
  cancelButton: page.getByRole('button', { name: /cancel/i }),
  saveButton: page.getByRole('button', { name: /save/i }),
});

type ListFields = {
  ' $fragmentRefs'?: {
    ListFieldsCollectionFragment: ListFieldsCollectionFragment;
  };
};

export const emptyListFields = {
  __typename: 'list_fieldsConnection',
  edges: [],
} as ListFields;

export const openAddCardDialog = async () => {
  const { addCardDialogButton } = getAllElements();
  await addCardDialogButton.click();
};

export const renderAddCardDialog = (
  queryListFields = mockListFields as ListFields,
) => {
  return render(
    <MockedProvider>
      <BoardContextProvider
        boardId={mockBoardId}
        queryListFields={queryListFields}
      >
        <DialogsProvider>
          <AddCardActionButton />
          <AddCardDialog />
        </DialogsProvider>
      </BoardContextProvider>
    </MockedProvider>,
  );
};
