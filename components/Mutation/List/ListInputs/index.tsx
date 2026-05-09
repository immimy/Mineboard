import { Field_Type } from '@/gql/__generated__/graphql';
import CheckboxInput from './CheckboxInput';
import DateInput from './DateInput';
import ImageInput from './ImageInput';
import NumberInput from './NumberInput';
import TagInput from './TagInput';
import TextInput from './TextInput';
import { ListFieldData, QueryListField } from '@/types/app';
import {
  CheckboxSchema,
  DateInputSchema,
  ImageSchema,
  ListField,
  NumberSchema,
  TagSchema,
  TextSchema,
} from '@/types/jsonbSchema';
import { memo } from 'react';

export function getFieldTitle<
  TData extends Extract<ListField, { config: { title: string } }>,
>(field: QueryListField) {
  const config = field.config as TData['config'];
  return config.title;
}

export type ListFieldInputProps = {
  field: QueryListField;
  form: ListFieldData<ListField>;
  handleFieldChange: (fieldId: string, value: ListFieldData) => void;
};

const RenderListInput = memo(
  ({ field, form, handleFieldChange }: ListFieldInputProps) => {
    switch (field.type) {
      case Field_Type.Checkbox:
        return (
          <CheckboxInput
            field={field}
            form={form as ListFieldData<CheckboxSchema>}
            handleFieldChange={handleFieldChange}
          />
        );
      case Field_Type.Date:
        return (
          <DateInput
            field={field}
            form={form as ListFieldData<DateInputSchema>}
            handleFieldChange={handleFieldChange}
          />
        );
      case Field_Type.Image:
        return (
          <ImageInput
            field={field}
            form={form as ListFieldData<ImageSchema>}
            handleFieldChange={handleFieldChange}
          />
        );
      case Field_Type.Number:
        return (
          <NumberInput
            field={field}
            form={form as ListFieldData<NumberSchema>}
            handleFieldChange={handleFieldChange}
          />
        );
      case Field_Type.Tag:
        return (
          <TagInput
            field={field}
            form={form as ListFieldData<TagSchema>}
            handleFieldChange={handleFieldChange}
          />
        );
      case Field_Type.Text:
        return (
          <TextInput
            field={field}
            form={form as ListFieldData<TextSchema>}
            handleFieldChange={handleFieldChange}
          />
        );
      default:
        return null;
    }
  },
);
export default RenderListInput;
