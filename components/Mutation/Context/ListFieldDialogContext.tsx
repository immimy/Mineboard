'use client';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type ListFieldDialogState = {
  isOpen: boolean;
};

type ListFieldDialogActions = {
  openListFieldDialog: () => void;
  closeListFieldDialog: () => void;
};

const ListFieldDialogStateContext = createContext<
  ListFieldDialogState | undefined
>(undefined);
const ListFieldDialogActionsContext = createContext<
  ListFieldDialogActions | undefined
>(undefined);

export function useListFieldDialogState() {
  const state = useContext(ListFieldDialogStateContext);
  if (!state) {
    throw new Error('useListFieldDialogState must be used in DialogsProvider');
  }
  return state;
}

export function useListFieldDialogActions() {
  const actions = useContext(ListFieldDialogActionsContext);
  if (!actions) {
    throw new Error(
      'useListFieldDialogActions must be used in DialogsProvider',
    );
  }
  return actions;
}

export function ListFieldDialogProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);

  const openListFieldDialog = useCallback(() => setIsOpen(true), []);
  const closeListFieldDialog = useCallback(() => setIsOpen(false), []);

  const state = useMemo(() => ({ isOpen }), [isOpen]);
  const actions = useMemo(
    () => ({ openListFieldDialog, closeListFieldDialog }),
    [openListFieldDialog, closeListFieldDialog],
  );

  return (
    <ListFieldDialogActionsContext.Provider value={actions}>
      <ListFieldDialogStateContext.Provider value={state}>
        {children}
      </ListFieldDialogStateContext.Provider>
    </ListFieldDialogActionsContext.Provider>
  );
}
