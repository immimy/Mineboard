import { BoardTitleProvider } from '@/components/Mutation/Board/Title/BoardTitleContext';
import AppContextProvider from '@/components/global/AppContext';
import { ApolloWrapper } from '@/components/global/ApolloWrapper';
import type { PropsWithChildren } from 'react';
import LayoutMutationSyncProvider from '@/components/BoardPage/Board/LayoutMutationSyncProvider';

function AppProvider({ children }: PropsWithChildren) {
  return (
    <ApolloWrapper>
      <AppContextProvider>
        <BoardTitleProvider>
          <LayoutMutationSyncProvider>{children}</LayoutMutationSyncProvider>
        </BoardTitleProvider>
      </AppContextProvider>
    </ApolloWrapper>
  );
}

export default AppProvider;
