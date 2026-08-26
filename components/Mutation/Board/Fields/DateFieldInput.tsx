import { Field_Type } from '@/gql/__generated__/graphql';
import FieldInputWrapper from './FieldInputWrapper';
import { DateField } from '@/types/jsonbSchema';
import { SwitchInput, TextInput } from '@/components/form';

type DateFieldInputProps = {
  field: DateField & { position: number };
  onChange: (config: DateField['config']) => void;
  onRemove: () => void;
  onTypeChange: (type: Field_Type) => void;
};

function DateFieldInput({
  field,
  onChange,
  onRemove,
  onTypeChange,
}: DateFieldInputProps) {
  const config = field.config;

  return (
    <FieldInputWrapper
      field={field}
      onRemove={onRemove}
      onTypeChange={onTypeChange}
    >
      <TextInput
        id={`${field.id}-title`}
        label='Title'
        value={config.title}
        onChange={(title) => onChange({ ...config, title })}
        placeholder='Date Title (optional)'
      />
      <SwitchInput
        label='Time'
        description='Include a time next to the date.'
        checked={config.isIncludeTime}
        onChange={(isIncludeTime) => onChange({ ...config, isIncludeTime })}
      />
    </FieldInputWrapper>
  );
}

export default DateFieldInput;
