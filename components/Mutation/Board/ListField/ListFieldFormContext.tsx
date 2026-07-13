'use client';

import { createFieldDraft } from '@/components/Mutation/Board/Fields/utils';
import { Field_Type } from '@/gql/__generated__/graphql';
import { ListFieldForm } from '@/types/app';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type ContextType = {
  fields: ListFieldForm[];
  isDirty: boolean;
  addField: (type: Field_Type) => void;
  updateField: (field: ListFieldForm) => void;
  updateFieldType: (fieldId: string, type: Field_Type) => void;
  removeField: (fieldId: string) => void;
  resetFields: () => void;
};

type ListFieldFormProviderProps = PropsWithChildren<{
  initialFields?: ListFieldForm[];
}>;

const ListFieldFormContext = createContext<ContextType | undefined>(undefined);

export function useListFieldFormContext() {
  const state = useContext(ListFieldFormContext);
  if (!state) {
    throw new Error(
      'useListFieldFormContext must be used inside ListFieldFormProvider',
    );
  }
  return state;
}

function ListFieldFormProvider({
  children,
  initialFields = [],
}: ListFieldFormProviderProps) {
  const [fields, setFields] = useState<ListFieldForm[]>([...initialFields]);
  const isDirty = useMemo(
    () => JSON.stringify(fields) !== JSON.stringify(initialFields),
    [fields, initialFields],
  );

  const addField = useCallback((type: Field_Type) => {
    setFields((currentFields) => [
      ...currentFields,
      createFieldDraft({ type, position: currentFields.length }),
    ]);
  }, []);

  const updateField = useCallback((nextField: ListFieldForm) => {
    setFields((currentFields) =>
      currentFields.map((field) =>
        field.id === nextField.id ? nextField : field,
      ),
    );
  }, []);

  const updateFieldType = useCallback((fieldId: string, type: Field_Type) => {
    setFields((currentFields) =>
      currentFields.map((field) =>
        field.id === fieldId
          ? createFieldDraft({ type, id: fieldId, position: field.position })
          : field,
      ),
    );
  }, []);

  const removeField = useCallback((fieldId: string) => {
    setFields((currentFields) =>
      currentFields
        .filter((field) => field.id !== fieldId)
        .map((field, position) => ({ ...field, position })),
    );
  }, []);

  const resetFields = useCallback(() => {
    setFields([...initialFields]);
  }, [initialFields]);

  const value = useMemo(
    () => ({
      fields,
      isDirty,
      addField,
      updateField,
      updateFieldType,
      removeField,
      resetFields,
    }),
    [
      addField,
      fields,
      isDirty,
      removeField,
      resetFields,
      updateField,
      updateFieldType,
    ],
  );

  return (
    <ListFieldFormContext.Provider value={value}>
      {children}
    </ListFieldFormContext.Provider>
  );
}
export default ListFieldFormProvider;
