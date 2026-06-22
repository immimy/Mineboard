import {
  Field_Type,
  ListFieldsCollectionFragmentDoc,
} from '@/gql/__generated__/graphql';
import { ResultOf } from '@graphql-typed-document-node/core';
import CheckboxInput from './CheckboxInput';
import DateInput from './DateInput';
import ImageInput from './ImageInput';
import NumberInput from './NumberInput';
import TagInput from './TagInput';
import TextInput from './TextInput';
import {
  CheckboxInput as CheckboxForm,
  DateInput as DateForm,
  ImageInput as ImageForm,
  NumberInput as NumberForm,
  TagInput as TagForm,
  TextInput as TextForm,
  ListFieldInput,
} from '@/types/jsonbSchema';
import { memo } from 'react';

type ListFieldQuery = ResultOf<
  typeof ListFieldsCollectionFragmentDoc
>['edges'][0]['node'];

export const getFieldTitle = (field: ListFieldQuery) => {
  const title = field.config?.title;
  return typeof title === 'string' ? title : '';
};

export type ListFieldInputProps = {
  field: ListFieldQuery;
  form: ListFieldInput;
  handleFieldChange: (fieldId: string, value: ListFieldInput) => void;
};

const RenderListInput = memo(
  ({ field, form, handleFieldChange }: ListFieldInputProps) => {
    switch (field.type) {
      case Field_Type.Checkbox:
        return (
          <CheckboxInput
            field={field}
            form={form as CheckboxForm}
            handleFieldChange={handleFieldChange}
          />
        );
      case Field_Type.Date:
        return (
          <DateInput
            field={field}
            form={form as DateForm}
            handleFieldChange={handleFieldChange}
          />
        );
      case Field_Type.Image:
        return (
          <ImageInput
            field={field}
            form={form as ImageForm}
            handleFieldChange={handleFieldChange}
          />
        );
      case Field_Type.Number:
        return (
          <NumberInput
            field={field}
            form={form as NumberForm}
            handleFieldChange={handleFieldChange}
          />
        );
      case Field_Type.Tag:
        return (
          <TagInput
            field={field}
            form={form as TagForm}
            handleFieldChange={handleFieldChange}
          />
        );
      case Field_Type.Text:
        return (
          <TextInput
            field={field}
            form={form as TextForm}
            handleFieldChange={handleFieldChange}
          />
        );
      default:
        return null;
    }
  },
);
RenderListInput.displayName = 'RenderListInput';
export default RenderListInput;
