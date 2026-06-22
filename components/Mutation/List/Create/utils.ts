import {
  Field_Type,
  ListFieldsCollectionFragment,
} from '@/gql/__generated__/graphql';
import { ListForm } from '@/types/app';
import {
  CheckboxInput,
  DateInput,
  ImageInput,
  NumberInput,
  TagInput,
  TextInput,
} from '@/types/jsonbSchema';

export function initFormState(
  dbListFields: ListFieldsCollectionFragment['edges'] | undefined,
) {
  return (
    dbListFields?.reduce((acc, edge) => {
      const field = edge.node;
      acc[field.id] = initFieldState(field);
      return acc;
    }, {} as ListForm) ?? {}
  );
}

function initFieldState(
  dbListField: ListFieldsCollectionFragment['edges'][0]['node'],
) {
  const initialState = { type: dbListField.type };
  switch (dbListField.type) {
    case Field_Type.Checkbox:
      return Object.assign(initialState, {
        value: { checked: false, title: '' },
        meta: { tzOffset: new Date().getTimezoneOffset() },
      }) as unknown as CheckboxInput;

    case Field_Type.Date:
      return Object.assign(initialState, {
        value: '',
        meta: { tzOffset: new Date().getTimezoneOffset() },
      } as unknown as DateInput);

    case Field_Type.Image:
      return Object.assign(initialState, {
        value: [],
      } as unknown as ImageInput);

    case Field_Type.Number:
      return Object.assign(initialState, {
        value: '',
      } as unknown as NumberInput);

    case Field_Type.Tag:
      return Object.assign(initialState, {
        value: [],
      } as unknown as TagInput);

    case Field_Type.Text:
      return Object.assign(initialState, {
        value: '',
      } as unknown as TextInput);
  }
}
