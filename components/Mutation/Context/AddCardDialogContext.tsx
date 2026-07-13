'use client';

import { useBoardContext } from '@/components/BoardPage/BoardContext';
import type { CardFormState } from '@/components/Mutation/Card/CardDialog';
import { INITIAL_CARD_FORM } from './types';
import {
  createContext,
  type Dispatch,
  PropsWithChildren,
  type SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type AddCardDialogState = {
  isOpen: boolean;
  form: CardFormState;
};

type AddCardDialogActions = {
  openAddCard: () => void;
  closeAddCard: () => void;
  setForm: Dispatch<SetStateAction<CardFormState>>;
};

const AddCardDialogStateContext = createContext<AddCardDialogState | undefined>(
  undefined,
);
const AddCardDialogActionsContext = createContext<
  AddCardDialogActions | undefined
>(undefined);

export function useAddCardDialogState() {
  const state = useContext(AddCardDialogStateContext);
  if (!state)
    throw new Error('useAddCardDialogState must be used in DialogsProvider');
  return state;
}

export function useAddCardDialogActions() {
  const actions = useContext(AddCardDialogActionsContext);
  if (!actions) {
    throw new Error('useAddCardDialogActions must be used in DialogsProvider');
  }
  return actions;
}

export function AddCardDialogProvider({ children }: PropsWithChildren) {
  const { dbListFields } = useBoardContext();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<CardFormState>({ ...INITIAL_CARD_FORM });

  const openAddCard = useCallback(() => {
    if (!dbListFields?.length) return;

    setForm({ ...INITIAL_CARD_FORM });
    setIsOpen(true);
  }, [dbListFields]);

  const closeAddCard = useCallback(() => {
    setIsOpen(false);
    setForm({ ...INITIAL_CARD_FORM });
  }, []);

  const state = useMemo(() => ({ isOpen, form }), [isOpen, form]);
  const actions = useMemo(
    () => ({ openAddCard, closeAddCard, setForm }),
    [openAddCard, closeAddCard],
  );

  return (
    <AddCardDialogActionsContext.Provider value={actions}>
      <AddCardDialogStateContext.Provider value={state}>
        {children}
      </AddCardDialogStateContext.Provider>
    </AddCardDialogActionsContext.Provider>
  );
}
