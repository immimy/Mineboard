'use client';

import { Field_Type } from '@/gql/__generated__/graphql';
import { ListFieldDraft } from '@/types/jsonbSchema';
import { createFieldDraft } from '@/components/Mutation/Board/Fields/utils';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type ContextType = {
  fields: ListFieldDraft[];
  addField: (type: Field_Type) => void;
  updateField: (field: ListFieldDraft) => void;
  updateFieldType: (fieldId: string, type: Field_Type) => void;
  removeField: (fieldId: string) => void;
  resetFields: () => void;
};

const AddListFieldContext = createContext<ContextType | undefined>(undefined);

export function useAddListFieldContext() {
  const state = useContext(AddListFieldContext);
  if (!state) {
    throw new Error(
      'useAddListFieldContext must be used inside AddListFieldProvider',
    );
  }
  return state;
}

function AddListFieldProvider({ children }: PropsWithChildren) {
  const [fields, setFields] = useState<ListFieldDraft[]>([]);

  const addField = useCallback((type: Field_Type) => {
    setFields((currentFields) => [...currentFields, createFieldDraft(type)]);
  }, []);

  const updateField = useCallback((nextField: ListFieldDraft) => {
    setFields((currentFields) =>
      currentFields.map((field) =>
        field.id === nextField.id ? nextField : field,
      ),
    );
  }, []);

  const updateFieldType = useCallback((fieldId: string, type: Field_Type) => {
    setFields((currentFields) =>
      currentFields.map((field) =>
        field.id === fieldId ? createFieldDraft(type, fieldId) : field,
      ),
    );
  }, []);

  const removeField = useCallback((fieldId: string) => {
    setFields((currentFields) =>
      currentFields.filter((field) => field.id !== fieldId),
    );
  }, []);

  const resetFields = useCallback(() => {
    setFields([]);
  }, []);

  const value = useMemo(
    () => ({
      fields,
      addField,
      updateField,
      updateFieldType,
      removeField,
      resetFields,
    }),
    [addField, fields, removeField, resetFields, updateField, updateFieldType],
  );

  return (
    <AddListFieldContext.Provider value={value}>
      {children}
    </AddListFieldContext.Provider>
  );
}
export default AddListFieldProvider;
