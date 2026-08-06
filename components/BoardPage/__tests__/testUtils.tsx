import { MockedProvider } from '@apollo/client/testing/react';
import { render } from 'vitest-browser-react';
import BoardContainer from '../BoardContainer';
import { mockBoardId } from './singleBoardQuery.mock';
import { MockLink } from '@apollo/client/testing';
import AppContextProvider from '@/components/global/AppContext';
import { BoardTitleProvider } from '@/components/Mutation/Board/Title/BoardTitleContext';
import type { SingleBoardQuery } from '@/gql/__generated__/graphql';

export const renderBoard = (mocks?: MockLink.MockedResponse[]) => {
  return render(
    <MockedProvider mocks={mocks}>
      <AppContextProvider>
        <BoardTitleProvider>
          <BoardContainer boardId={mockBoardId} />
        </BoardTitleProvider>
      </AppContextProvider>
    </MockedProvider>,
  );
};

export const renderReadOnlyBoard = (initialData: SingleBoardQuery) => {
  return render(
    <MockedProvider>
      <AppContextProvider>
        <BoardTitleProvider>
          <BoardContainer
            boardId={mockBoardId}
            initialListFields={initialData.list_fieldsCollection}
            initialCards={initialData.cardsCollection}
            isReadonly
          />
        </BoardTitleProvider>
      </AppContextProvider>
    </MockedProvider>,
  );
};
