import { Field_Type } from '@/gql/__generated__/graphql';
import { ListValueInput } from './validator';
import { ListForm } from '@/types/app';

/**
 * List form contains at least one field value
 * (client form validation)
 */
export const isListFormEmpty = (form: ListForm): boolean => {
  const inputs = Object.values(form);
  return (
    inputs.filter((fv) => {
      const { type, value } = fv;
      switch (type) {
        case Field_Type.Text:
          return value.trim() !== '';
        case Field_Type.Number:
          return value !== '';
        case Field_Type.Date:
          return value !== '';
        case Field_Type.Image:
          return Boolean(value.length);
        case Field_Type.Checkbox:
          return value.title.trim() !== '';
        case Field_Type.Tag:
          return Boolean(value.length);

        default:
          throw new Error(`${type} is not supported.`);
      }
    }).length < 1
  );
};

/**
 * Returns true when a field value is considered "empty" and should NOT
 * create a list_value row in the database.
 */
function isEmptyFieldValue(fieldValue: ListValueInput): boolean {
  const { fieldType, input } = fieldValue;
  switch (fieldType) {
    case Field_Type.Text:
      return input.value.trim() === '';
    case Field_Type.Number:
      return input.value === '';
    case Field_Type.Date:
      return input.value === '';
    case Field_Type.Image:
      return !Boolean(input.value.length);
    case Field_Type.Checkbox:
      return input.value.title.trim() === '';
    case Field_Type.Tag:
      return !Boolean(input.value.length);

    default:
      throw new Error(`${fieldType} is not supported.`);
  }
}

/**
 * create_list_with_values rpc input
 */
export function formatToRpcCreateListValues(fieldValues: ListValueInput[]) {
  return (
    fieldValues
      // Strips empty list values so they do not create list_value rows
      .filter((fv) => !isEmptyFieldValue(fv))
      // Converts into the shape the RPC expects
      .map((fv) => ({
        list_field_id: fv.listFieldId,
        value: fv.input.value,
      }))
  );
}
