import { MockedProvider } from '@apollo/client/testing/react';
import { render } from 'vitest-browser-react';
import BoardContainer from '../Board/BoardContainer';
import { mockBoardId } from './singleBoardQuery.mock';
import { MockLink } from '@apollo/client/testing';
import AppContextProvider from '@/components/global/AppContext';
import { BoardTitleProvider } from '@/components/Mutation/Board/Title/BoardTitleContext';
import type { SingleBoardQuery } from '@/gql/__generated__/graphql';
import LayoutMutationSyncProvider from '../Board/LayoutMutationSyncProvider';

export const renderBoard = (mocks?: MockLink.MockedResponse[]) => {
  return render(
    <MockedProvider mocks={mocks}>
      <AppContextProvider>
        <BoardTitleProvider>
          <LayoutMutationSyncProvider>
            <BoardContainer boardId={mockBoardId} />
          </LayoutMutationSyncProvider>
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
          <LayoutMutationSyncProvider>
            <BoardContainer
              boardId={mockBoardId}
              initialListFields={initialData.list_fieldsCollection}
              initialCards={initialData.cardsCollection}
              isReadonly
            />
          </LayoutMutationSyncProvider>
        </BoardTitleProvider>
      </AppContextProvider>
    </MockedProvider>,
  );
};
