import { Field_Type } from '@/gql/__generated__/graphql';
import { TextInput } from '@/components/form';
import FieldInputWrapper from './FieldInputWrapper';
import { TextField } from '@/types/jsonbSchema';

type TextFieldInputProps = {
  field: TextField;
  onChange: (config: TextField['config']) => void;
  onRemove: () => void;
  onTypeChange: (type: Field_Type) => void;
};

function TextFieldInput({
  field,
  onChange,
  onRemove,
  onTypeChange,
}: TextFieldInputProps) {
  return (
    <FieldInputWrapper
      type={field.type}
      onRemove={onRemove}
      onTypeChange={onTypeChange}
    >
      <TextInput
        id={`${field.id}-title`}
        label='Title'
        value={field.config.title}
        onChange={(title) => onChange({ title })}
        placeholder='Text Title (optional)'
      />
    </FieldInputWrapper>
  );
}

export default TextFieldInput;
