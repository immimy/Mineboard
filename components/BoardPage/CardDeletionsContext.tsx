'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

/** CONTEXT */

type ContextType = {
  isDeleteMode: boolean;
  deletedCards: Set<string>;
  setDeleteMode: (value: boolean) => void;
  updateDeletedCards: (cardId: string) => void;
};

const CardDeletionsContext = createContext<undefined | ContextType>(undefined);

export const useCardDeletionsContext = () => {
  const state = useContext(CardDeletionsContext);
  if (!state)
    throw new Error(
      'useCardDeletionsContext must be used in CardDeletionsProvider',
    );
  return state;
};

/** PROPS */

type CardDeletionsContextProps = {} & React.PropsWithChildren;

function CardDeletionsProvider({ children }: CardDeletionsContextProps) {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [deletedCards, setDeletedCards] = useState<Set<string>>(new Set());

  const setDeleteMode = useCallback((value: boolean) => {
    if (!value) {
      setDeletedCards(new Set());
    }
    setIsDeleteMode(value);
  }, []);

  const updateDeletedCards = useCallback((cardId: string) => {
    setDeletedCards((prevState) => {
      const state = new Set(prevState);
      if (state.has(cardId)) {
        state.delete(cardId);
      } else {
        state.add(cardId);
      }
      return state;
    });
  }, []);

  const ctx = useMemo(
    () => ({ isDeleteMode, deletedCards, setDeleteMode, updateDeletedCards }),
    [isDeleteMode, deletedCards, setDeleteMode, updateDeletedCards],
  );

  return (
    <CardDeletionsContext.Provider value={ctx}>
      {children}
    </CardDeletionsContext.Provider>
  );
}
export default CardDeletionsProvider;
