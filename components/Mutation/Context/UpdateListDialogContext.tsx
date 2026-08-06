'use client';

import { useBoardContext } from '@/components/BoardPage/BoardContext';
import { initFormState } from '@/components/Mutation/List/utils';
import type { ListFieldsCollectionFragment } from '@/gql/__generated__/graphql';
import type { ListForm } from '@/types/app';
import type { ListFieldInput } from '@/types/jsonbSchema';
import type { UpdateListInput } from './types';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type UpdateListDialogState = {
  isOpen: boolean;
  cardId?: string;
  listId?: string;
  listFields?: ListFieldsCollectionFragment['edges'];
  form: ListForm;
};

type UpdateListDialogActions = {
  openUpdateList: (input: UpdateListInput) => void;
  closeUpdateList: () => void;
  updateField: (fieldId: string, value: ListFieldInput) => void;
};

const UpdateListDialogStateContext = createContext<
  UpdateListDialogState | undefined
>(undefined);
const UpdateListDialogActionsContext = createContext<
  UpdateListDialogActions | undefined
>(undefined);

export function useUpdateListDialogState() {
  const state = useContext(UpdateListDialogStateContext);
  if (!state) {
    throw new Error('useUpdateListDialogState must be used in DialogsProvider');
  }
  return state;
}

export function useUpdateListDialogActions() {
  const actions = useContext(UpdateListDialogActionsContext);
  if (!actions) {
    throw new Error(
      'useUpdateListDialogActions must be used in DialogsProvider',
    );
  }
  return actions;
}

export function UpdateListDialogProvider({ children }: PropsWithChildren) {
  const { dbListFields } = useBoardContext();
  const [isOpen, setIsOpen] = useState(false);
  const [cardId, setCardId] = useState<string>();
  const [listId, setListId] = useState<string>();
  const [form, setForm] = useState<ListForm>({});

  const openUpdateList = useCallback(
    (input: UpdateListInput) => {
      setIsOpen(true);
      setCardId(input.cardId);
      setListId(input.listId);
      setForm(initFormState(dbListFields, input.listValues));
    },
    [dbListFields],
  );

  const closeUpdateList = useCallback(() => {
    setIsOpen(false);
    setCardId(undefined);
    setListId(undefined);
    setForm({});
  }, []);

  const updateField = useCallback((fieldId: string, value: ListFieldInput) => {
    setForm((currentForm) => ({ ...currentForm, [fieldId]: value }));
  }, []);

  const state = useMemo(
    () => ({ isOpen, cardId, listId, listFields: dbListFields, form }),
    [isOpen, cardId, listId, dbListFields, form],
  );
  const actions = useMemo(
    () => ({ openUpdateList, closeUpdateList, updateField }),
    [openUpdateList, closeUpdateList, updateField],
  );

  return (
    <UpdateListDialogActionsContext.Provider value={actions}>
      <UpdateListDialogStateContext.Provider value={state}>
        {children}
      </UpdateListDialogStateContext.Provider>
    </UpdateListDialogActionsContext.Provider>
  );
}
