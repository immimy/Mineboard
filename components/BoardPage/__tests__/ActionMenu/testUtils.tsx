import AppContextProvider from '@/components/global/AppContext';
import AddCardDialog from '@/components/Mutation/Card/AddCardDialog';
import ListFieldDialog from '@/components/Mutation/Board/ListField/ListFieldDialog';
import { BoardTitleProvider } from '@/components/Mutation/Board/Title/BoardTitleContext';
import UpdateBoardTitle from '@/components/Mutation/Board/Title/UpdateBoardTitle';
import type { ListFieldsCollectionFragment } from '@/gql/__generated__/graphql';
import { MockedProvider } from '@apollo/client/testing/react';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { vi } from 'vitest';
import ActionMenuContainer from '../../ActionMenuContainer';
import BoardContextProvider from '../../BoardContext';
import DialogsProvider from '@/components/Mutation/Context/DialogsProvider';
import { mockBoardId, mockListFields } from '../singleBoardQuery.mock';

vi.mock('@/utils/actions/card');
vi.mock('@/utils/actions/board');

const listFieldsWithValues = mockListFields as {
  ' $fragmentRefs'?: {
    ListFieldsCollectionFragment: ListFieldsCollectionFragment;
  };
};

type ListFieldsQuery = typeof listFieldsWithValues | null;
const mockBoardTitle = 'Test Board';

export const renderActionMenu = (
  queryListFields: ListFieldsQuery = listFieldsWithValues,
) => {
  return render(
    <MockedProvider>
      <AppContextProvider>
        <BoardTitleProvider>
          <BoardContextProvider
            boardId={mockBoardId}
            queryListFields={queryListFields}
          >
            <DialogsProvider>
              {/* Action Menu */}
              <ActionMenuContainer />

              {/* Other Components */}
              <UpdateBoardTitle boardId={mockBoardId} title={mockBoardTitle} />
              <ListFieldDialog />
              <AddCardDialog />
            </DialogsProvider>
          </BoardContextProvider>
        </BoardTitleProvider>
      </AppContextProvider>
    </MockedProvider>,
  );
};

export const getAllElements = () => {
  return {
    menuToggle: page.getByRole('button', { name: /action menu button/i }),
    addNewCardButton: page.getByRole('button', { name: /add new card/i }),
    editBoardTitleButton: page.getByRole('menuitem', {
      name: /edit board title/i,
    }),
    customListFieldsButton: page.getByRole('menuitem', {
      name: /custom list fields/i,
    }),
    deleteBoardButton: page.getByRole('menuitem', {
      name: /delete board/i,
    }),
    createCardHeader: page.getByRole('heading', {
      level: 2,
      name: /create card/i,
    }),
    listFieldsDescription: page.getByText(/personalize the list item/i),
    boardTitleInput: page.getByRole('textbox', { name: /board title/i }),
  };
};

export const openActionMenu = async () => {
  const { menuToggle } = getAllElements();
  await userEvent.click(menuToggle);
};
