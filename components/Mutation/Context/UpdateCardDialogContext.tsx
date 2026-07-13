'use client';

import type { UpdateCardFormState } from './types';
import { INITIAL_UPDATE_CARD_FORM } from './types';
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

type UpdateCardDialogState = {
  isOpen: boolean;
  form: UpdateCardFormState;
};

type UpdateCardDialogActions = {
  openUpdateCard: (input: UpdateCardFormState) => void;
  closeUpdateCard: () => void;
  setForm: Dispatch<SetStateAction<UpdateCardFormState>>;
};

const UpdateCardDialogStateContext = createContext<
  UpdateCardDialogState | undefined
>(undefined);
const UpdateCardDialogActionsContext = createContext<
  UpdateCardDialogActions | undefined
>(undefined);

export function useUpdateCardDialogState() {
  const state = useContext(UpdateCardDialogStateContext);
  if (!state) {
    throw new Error('useUpdateCardDialogState must be used in DialogsProvider');
  }
  return state;
}

export function useUpdateCardDialogActions() {
  const actions = useContext(UpdateCardDialogActionsContext);
  if (!actions) {
    throw new Error(
      'useUpdateCardDialogActions must be used in DialogsProvider',
    );
  }
  return actions;
}

export function UpdateCardDialogProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<UpdateCardFormState>({
    ...INITIAL_UPDATE_CARD_FORM,
  });

  const openUpdateCard = useCallback((input: UpdateCardFormState) => {
    setForm({ ...input });
    setIsOpen(true);
  }, []);

  const closeUpdateCard = useCallback(() => {
    setIsOpen(false);
    setForm({ ...INITIAL_UPDATE_CARD_FORM });
  }, []);

  const state = useMemo(() => ({ isOpen, form }), [isOpen, form]);
  const actions = useMemo(
    () => ({ openUpdateCard, closeUpdateCard, setForm }),
    [openUpdateCard, closeUpdateCard, setForm],
  );

  return (
    <UpdateCardDialogActionsContext.Provider value={actions}>
      <UpdateCardDialogStateContext.Provider value={state}>
        {children}
      </UpdateCardDialogStateContext.Provider>
    </UpdateCardDialogActionsContext.Provider>
  );
}
