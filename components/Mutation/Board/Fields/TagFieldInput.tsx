import { Field_Type } from '@/gql/__generated__/graphql';
import { ColorInput } from '@/components/form';
import FieldInputWrapper from './FieldInputWrapper';
import { TagField } from '@/types/jsonbSchema';

type TagFieldInputProps = {
  field: TagField & { position: number };
  onChange: (config: TagField['config']) => void;
  onRemove: () => void;
  onTypeChange: (type: Field_Type) => void;
};

function TagFieldInput({
  field,
  onChange,
  onRemove,
  onTypeChange,
}: TagFieldInputProps) {
  return (
    <FieldInputWrapper
      field={field}
      onRemove={onRemove}
      onTypeChange={onTypeChange}
    >
      <ColorInput
        label='default tag color'
        name={`${field.id}-tag-color`}
        value={field.config.color}
        onChange={(color) => onChange({ color })}
      />
    </FieldInputWrapper>
  );
}

export default TagFieldInput;
