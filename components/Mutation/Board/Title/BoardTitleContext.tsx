'use client';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type BoardTitleState = {
  isUpdating: boolean;
};

type BoardTitleActions = {
  startUpdating: () => void;
  cancelUpdating: () => void;
};

const BoardTitleStateContext = createContext<BoardTitleState | undefined>(
  undefined,
);
const BoardTitleActionsContext = createContext<BoardTitleActions | undefined>(
  undefined,
);

export function useBoardTitleState() {
  const state = useContext(BoardTitleStateContext);
  if (!state) {
    throw new Error('useBoardTitleState must be used in BoardTitleProvider');
  }
  return state;
}

export function useBoardTitleActions() {
  const actions = useContext(BoardTitleActionsContext);
  if (!actions) {
    throw new Error('useBoardTitleActions must be used in BoardTitleProvider');
  }
  return actions;
}

export function BoardTitleProvider({ children }: PropsWithChildren) {
  const [isUpdating, setIsUpdating] = useState(false);

  const startUpdating = useCallback(() => {
    setIsUpdating(true);
  }, []);

  const cancelUpdating = useCallback(() => {
    setIsUpdating(false);
  }, []);

  const state = useMemo(() => ({ isUpdating }), [isUpdating]);
  const actions = useMemo(
    () => ({
      startUpdating,
      cancelUpdating,
    }),
    [startUpdating, cancelUpdating],
  );

  return (
    <BoardTitleActionsContext.Provider value={actions}>
      <BoardTitleStateContext.Provider value={state}>
        {children}
      </BoardTitleStateContext.Provider>
    </BoardTitleActionsContext.Provider>
  );
}
