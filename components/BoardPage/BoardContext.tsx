'use client';

import {
  FragmentType,
  graphql,
  useFragment as readFragment,
} from '@/gql/__generated__';
import { ResultOf } from '@graphql-typed-document-node/core';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

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

/** CONTEXT */

type ContextType = {
  boardId: string;
  dbListFields?: ResultOf<typeof ListFieldsCollectionFragment>['edges'];
  isAddListFieldOpen: boolean;
  openAddListField: () => void;
  closeAddListField: () => void;
  isAddCardOpen: boolean;
  openAddCard: () => void;
  closeAddCard: () => void;
  isAddListOpen: boolean;
  addListCardId?: string;
  openAddList: (cardId: string) => void;
  closeAddList: () => void;
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
  queryListFields?: FragmentType<typeof ListFieldsCollectionFragment> | null;
} & React.PropsWithChildren;

function BoardContextWrapper({
  children,
  boardId,
  queryListFields,
}: BoardContextProps) {
  /** Board: add feature */
  // AddListField dialog
  const [isAddListFieldOpen, setIsAddListFieldOpen] = useState(false);

  const openAddListField = useCallback(() => {
    setIsAddListFieldOpen(true);
  }, []);

  const closeAddListField = useCallback(() => {
    setIsAddListFieldOpen(false);
  }, []);

  /** List: add feature */
  // List Fields retrieved from database
  const dbListFields = useMemo(
    () => readFragment(ListFieldsCollectionFragment, queryListFields)?.edges,
    [queryListFields],
  );

  /** Card: add feature */
  // AddCard dialog
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  const openAddCard = useCallback(() => {
    if (!dbListFields?.length) return;
    setIsAddCardOpen(true);
  }, [dbListFields]);

  const closeAddCard = useCallback(() => {
    setIsAddCardOpen(false);
  }, []);

  // AddList dialog
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [addListCardId, setAddListCardId] = useState<string>();

  const openAddList = useCallback((cardId: string) => {
    setIsAddListOpen(true);
    setAddListCardId(cardId);
  }, []);

  const closeAddList = useCallback(() => {
    setIsAddListOpen(false);
    setAddListCardId(undefined);
  }, []);

  return (
    <BoardContext.Provider
      value={{
        boardId,
        isAddListFieldOpen,
        openAddListField,
        closeAddListField,
        isAddCardOpen,
        openAddCard,
        closeAddCard,
        dbListFields,
        isAddListOpen,
        addListCardId,
        openAddList,
        closeAddList,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}
export default BoardContextWrapper;
