import { BoardTitleProvider } from '@/components/Mutation/Board/Title/BoardTitleContext';
import AppContextProvider from '@/components/global/AppContext';
import { ApolloWrapper } from '@/components/global/ApolloWrapper';
import type { PropsWithChildren } from 'react';

function AppProvider({ children }: PropsWithChildren) {
  return (
    <ApolloWrapper>
      <AppContextProvider>
        <BoardTitleProvider>{children}</BoardTitleProvider>
      </AppContextProvider>
    </ApolloWrapper>
  );
}

export default AppProvider;
