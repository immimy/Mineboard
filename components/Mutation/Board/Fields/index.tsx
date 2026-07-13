import { Field_Type } from '@/gql/__generated__/graphql';
import CheckboxFieldInput from './CheckboxFieldInput';
import DateFieldInput from './DateFieldInput';
import ImageFieldInput from './ImageFieldInput';
import NumberFieldInput from './NumberFieldInput';
import TagFieldInput from './TagFieldInput';
import TextFieldInput from './TextFieldInput';
import { ListFieldForm } from '@/types/app';

type FieldInputProps = {
  field: ListFieldForm;
  onConfigChange: (field: ListFieldForm) => void;
  onTypeChange: (type: Field_Type) => void;
  onRemove: () => void;
};

function FieldInput({
  field,
  onConfigChange,
  onTypeChange,
  onRemove,
}: FieldInputProps) {
  switch (field.type) {
    case Field_Type.Checkbox:
      return (
        <CheckboxFieldInput
          field={field}
          onChange={(config) => onConfigChange({ ...field, config })}
          onTypeChange={onTypeChange}
          onRemove={onRemove}
        />
      );
    case Field_Type.Date:
      return (
        <DateFieldInput
          field={field}
          onChange={(config) => onConfigChange({ ...field, config })}
          onTypeChange={onTypeChange}
          onRemove={onRemove}
        />
      );
    case Field_Type.Image:
      return (
        <ImageFieldInput
          field={field}
          onChange={(config) => onConfigChange({ ...field, config })}
          onTypeChange={onTypeChange}
          onRemove={onRemove}
        />
      );
    case Field_Type.Number:
      return (
        <NumberFieldInput
          field={field}
          onChange={(config) => onConfigChange({ ...field, config })}
          onTypeChange={onTypeChange}
          onRemove={onRemove}
        />
      );
    case Field_Type.Tag:
      return (
        <TagFieldInput
          field={field}
          onChange={(config) => onConfigChange({ ...field, config })}
          onTypeChange={onTypeChange}
          onRemove={onRemove}
        />
      );
    case Field_Type.Text:
      return (
        <TextFieldInput
          field={field}
          onChange={(config) => onConfigChange({ ...field, config })}
          onTypeChange={onTypeChange}
          onRemove={onRemove}
        />
      );
  }
}

export default FieldInput;
