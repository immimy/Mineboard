'use client';

import { useBoardContext } from '@/components/BoardPage/BoardContext';
import { initFormState } from '@/components/Mutation/List/utils';
import type { ListFieldsCollectionFragment } from '@/gql/__generated__/graphql';
import type { ListForm } from '@/types/app';
import type { ListFieldInput } from '@/types/jsonbSchema';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type AddListDialogState = {
  isOpen: boolean;
  cardId?: string;
  listFields?: ListFieldsCollectionFragment['edges'];
  form: ListForm;
};

type AddListDialogActions = {
  openAddList: (cardId: string) => void;
  closeAddList: () => void;
  updateField: (fieldId: string, value: ListFieldInput) => void;
};

const AddListDialogStateContext = createContext<AddListDialogState | undefined>(
  undefined,
);
const AddListDialogActionsContext = createContext<
  AddListDialogActions | undefined
>(undefined);

export function useAddListDialogState() {
  const state = useContext(AddListDialogStateContext);
  if (!state)
    throw new Error('useAddListDialogState must be used in DialogsProvider');
  return state;
}

export function useAddListDialogActions() {
  const actions = useContext(AddListDialogActionsContext);
  if (!actions) {
    throw new Error('useAddListDialogActions must be used in DialogsProvider');
  }
  return actions;
}

export function AddListDialogProvider({ children }: PropsWithChildren) {
  const { dbListFields } = useBoardContext();
  const [isOpen, setIsOpen] = useState(false);
  const [cardId, setCardId] = useState<string>();
  const [form, setForm] = useState<ListForm>({});

  const openAddList = useCallback(
    (nextCardId: string) => {
      setIsOpen(true);
      setCardId(nextCardId);
      setForm(initFormState(dbListFields));
    },
    [dbListFields],
  );

  const closeAddList = useCallback(() => {
    setIsOpen(false);
    setCardId(undefined);
    setForm({});
  }, []);

  const updateField = useCallback((fieldId: string, value: ListFieldInput) => {
    setForm((currentForm) => ({ ...currentForm, [fieldId]: value }));
  }, []);

  const state = useMemo(
    () => ({ isOpen, cardId, listFields: dbListFields, form }),
    [isOpen, cardId, dbListFields, form],
  );
  const actions = useMemo(
    () => ({ openAddList, closeAddList, updateField }),
    [openAddList, closeAddList, updateField],
  );

  return (
    <AddListDialogActionsContext.Provider value={actions}>
      <AddListDialogStateContext.Provider value={state}>
        {children}
      </AddListDialogStateContext.Provider>
    </AddListDialogActionsContext.Provider>
  );
}
