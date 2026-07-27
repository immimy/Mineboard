'use client';

import {
  FragmentType,
  graphql,
  useFragment as readFragment,
} from '@/gql/__generated__';
import { ResultOf } from '@graphql-typed-document-node/core';
import { createContext, useContext, useMemo } from 'react';

const ListFieldsCollectionFragment = graphql(/* GraphQL */ `
  fragment ListFieldsCollection on list_fieldsConnection {
    edges {
      node {
        id
        type
        config
        position
      }
    }
  }
`);

type ContextType = {
  boardId: string;
  userId?: string;
  dbListFields?: ResultOf<typeof ListFieldsCollectionFragment>['edges'];
};

const BoardContext = createContext<undefined | ContextType>(undefined);

export const useBoardContext = () => {
  const state = useContext(BoardContext);
  if (!state) throw new Error('useBoardContext must be used in BoardProvider');
  return state;
};

/** PROPS */

type BoardContextProps = {
  boardId: string;
  userId?: string;
  queryListFields?: FragmentType<typeof ListFieldsCollectionFragment> | null;
} & React.PropsWithChildren;

function BoardContextProvider({
  children,
  boardId,
  userId,
  queryListFields,
}: BoardContextProps) {
  // List Fields retrieved from database
  const dbListFields = useMemo(
    () => readFragment(ListFieldsCollectionFragment, queryListFields)?.edges,
    [queryListFields],
  );

  return (
    <BoardContext.Provider
      value={{
        boardId,
        userId,
        dbListFields,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}
export default BoardContextProvider;
