import {
  mockBoardId,
  mockListFields,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import AddNewCardActionButton from '@/components/BoardPage/ActionButtons/AddNewCardActionButton';
import BoardContextWrapper from '@/components/BoardPage/BoardContext';
import type { ListFieldsCollectionFragment } from '@/gql/__generated__/graphql';
import { ApolloCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing/react';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import AddCardDialog from '../AddCardDialog';

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

export const renderAddCardDialog = (
  cache?: ApolloCache,
  queryListFields = mockListFields as ListFields,
) => {
  return render(
    <MockedProvider cache={cache}>
      <BoardContextWrapper
        boardId={mockBoardId}
        queryListFields={queryListFields}
      >
        <AddNewCardActionButton />
        <AddCardDialog />
      </BoardContextWrapper>
    </MockedProvider>,
  );
};

const emptyListFields = {
  __typename: 'list_fieldsConnection',
  edges: [],
} as ListFields;

export const renderAddCardDialogWithoutListFields = (cache?: ApolloCache) =>
  renderAddCardDialog(cache, emptyListFields);
