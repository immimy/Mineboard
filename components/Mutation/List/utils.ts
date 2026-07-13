import {
  Field_Type,
  ListFieldsCollectionFragment,
} from '@/gql/__generated__/graphql';
import { ListForm } from '@/types/app';
import {
  CheckboxInput,
  DateInput,
  ImageInput,
  ListFieldValue,
  NumberInput,
  TagInput,
  TextInput,
} from '@/types/jsonbSchema';
import type { UpdateListInput } from '@/components/Mutation/Context/types';
import { UTCDateToLocal } from '@/utils/formatter/helper';

export function initFormState(
  dbListFields: ListFieldsCollectionFragment['edges'] | undefined,
  dbListValues?: UpdateListInput['listValues'],
) {
  return (
    dbListFields?.reduce((acc, edge) => {
      const field = edge.node;
      const listValue = dbListValues?.find(
        (item) => item.listFieldId === field.id,
      );
      acc[field.id] = initFieldState(field, listValue?.value);
      return acc;
    }, {} as ListForm) ?? {}
  );
}

function initFieldState(
  dbListField: ListFieldsCollectionFragment['edges'][0]['node'],
  dbListValue?: ListFieldValue,
) {
  const initialState = { type: dbListField.type };
  switch (dbListField.type) {
    case Field_Type.Checkbox:
      return Object.assign(initialState, {
        value: dbListValue ?? { checked: false, title: '' },
      }) as unknown as CheckboxInput;

    case Field_Type.Date:
      return Object.assign(initialState, {
        value:
          UTCDateToLocal(
            (dbListValue as DateInput['value']) ?? '',
            dbListField.config.isIncludeTime,
          ) ?? '',
        meta: { tzOffset: new Date().getTimezoneOffset() },
      } as unknown as DateInput);

    case Field_Type.Image:
      return Object.assign(initialState, {
        value: dbListValue ?? [],
      } as unknown as ImageInput);

    case Field_Type.Number:
      return Object.assign(initialState, {
        value: dbListValue ?? '',
      } as unknown as NumberInput);

    case Field_Type.Tag:
      return Object.assign(initialState, {
        value: dbListValue ?? [],
      } as unknown as TagInput);

    case Field_Type.Text:
      return Object.assign(initialState, {
        value: dbListValue ?? '',
      } as unknown as TextInput);
  }
}
