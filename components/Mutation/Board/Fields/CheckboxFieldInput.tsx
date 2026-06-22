import { Field_Type } from '@/gql/__generated__/graphql';
import FieldInputWrapper from './FieldInputWrapper';
import { CheckboxField } from '@/types/jsonbSchema';

type CheckboxFieldInputProps = {
  field: CheckboxField;
  onChange: (config: CheckboxField['config']) => void;
  onRemove: () => void;
  onTypeChange: (type: Field_Type) => void;
};

function CheckboxFieldInput({
  field,
  onRemove,
  onTypeChange,
}: CheckboxFieldInputProps) {
  return (
    <FieldInputWrapper
      type={field.type}
      onRemove={onRemove}
      onTypeChange={onTypeChange}
    />
  );
}

export default CheckboxFieldInput;
