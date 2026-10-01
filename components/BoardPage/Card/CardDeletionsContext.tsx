'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

/** CONTEXT */

type CardDeletionActions = {
  setDeleteMode: (value: boolean) => void;
  updateDeletedCards: (cardId: string) => void;
};

const CardDeletionModeContext = createContext<boolean | undefined>(undefined);
const CardDeletionSelectionContext = createContext<Set<string> | undefined>(
  undefined,
);
const CardDeletionActionsContext = createContext<
  CardDeletionActions | undefined
>(undefined);

export const useCardDeletionMode = () => {
  const isDeleteMode = useContext(CardDeletionModeContext);
  if (isDeleteMode === undefined)
    throw new Error(
      'useCardDeletionMode must be used in CardDeletionsProvider',
    );
  return isDeleteMode;
};

export const useCardDeletionSelection = () => {
  const deletedCards = useContext(CardDeletionSelectionContext);
  if (!deletedCards)
    throw new Error(
      'useCardDeletionSelection must be used in CardDeletionsProvider',
    );
  return deletedCards;
};

export const useCardDeletionActions = () => {
  const actions = useContext(CardDeletionActionsContext);
  if (!actions)
    throw new Error(
      'useCardDeletionActions must be used in CardDeletionsProvider',
    );
  return actions;
};

/** COMPONENT */

function CardDeletionsProvider({ children }: React.PropsWithChildren) {
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

  const actions = useMemo(
    () => ({ setDeleteMode, updateDeletedCards }),
    [setDeleteMode, updateDeletedCards],
  );

  return (
    <CardDeletionActionsContext.Provider value={actions}>
      <CardDeletionModeContext.Provider value={isDeleteMode}>
        <CardDeletionSelectionContext.Provider value={deletedCards}>
          {children}
        </CardDeletionSelectionContext.Provider>
      </CardDeletionModeContext.Provider>
    </CardDeletionActionsContext.Provider>
  );
}
export default CardDeletionsProvider;
