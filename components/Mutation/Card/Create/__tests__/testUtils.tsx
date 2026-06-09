import { mockBoardId } from '@/components/Board/__tests__/singleBoardQuery.mock';
import BoardContextWrapper from '@/components/Board/BoardContext';
import { ListFieldsCollectionFragment } from '@/gql/__generated__/graphql';
import { ApolloCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing/react';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import AddCardDialog from '../AddCardDialog';
import AddCardOpenButton from '../AddCardOpenButton';

export const getAllElements = () => ({
  addCardDialogButton: page.getByRole('button', { name: /add card/i }),
  header: page.getByRole('heading', { level: 2, name: /create card/i }),
  description: page.getByText(/add a new card to this board/i),
  titleInput: page.getByLabelText(/title/i),
  colorGroup: page.getByRole('radiogroup', { name: /color/i }),
  firstPalette: page.getByRole('radio', { name: /palette 1/i }),
  thirdPalette: page.getByRole('radio', { name: /palette 3/i }),
  cancelButton: page.getByRole('button', { name: /cancel/i }),
  saveButton: page.getByRole('button', { name: /save/i }),
});

const emptyListFields = {
  __typename: 'list_fieldsConnection',
  edges: [],
} as {
  ' $fragmentRefs'?: {
    ListFieldsCollectionFragment: ListFieldsCollectionFragment;
  };
};

export const renderAddCardDialog = (cache?: ApolloCache) => {
  return render(
    <MockedProvider cache={cache}>
      <BoardContextWrapper
        boardId={mockBoardId}
        queryListFields={emptyListFields}
      >
        <AddCardOpenButton />
        <AddCardDialog />
      </BoardContextWrapper>
    </MockedProvider>,
  );
};
