import { Field_Type } from '@/gql/__generated__/graphql';
import { TextInput } from '@/components/form';
import FieldInputWrapper from './FieldInputWrapper';
import { ImageField } from '@/types/jsonbSchema';

type ImageFieldInputProps = {
  field: ImageField;
  onChange: (config: ImageField['config']) => void;
  onRemove: () => void;
  onTypeChange: (type: Field_Type) => void;
};

function ImageFieldInput({
  field,
  onChange,
  onRemove,
  onTypeChange,
}: ImageFieldInputProps) {
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
        placeholder='Image Title (optional)'
      />
    </FieldInputWrapper>
  );
}

export default ImageFieldInput;
