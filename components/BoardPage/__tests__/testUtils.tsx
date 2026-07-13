import { MockedProvider } from '@apollo/client/testing/react';
import { render } from 'vitest-browser-react';
import BoardContainer from '../BoardContainer';
import { mockBoardId } from './singleBoardQuery.mock';
import { MockLink } from '@apollo/client/testing';
import AppContextProvider from '@/components/global/AppContext';
import { BoardTitleProvider } from '@/components/Mutation/Board/Title/BoardTitleContext';

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
