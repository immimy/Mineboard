import { Field_Type } from '@/gql/__generated__/graphql';
import FieldInputWrapper from './FieldInputWrapper';
import { RadioInput, SwitchInput, TextInput } from '@/components/form';
import { NumberField } from '@/types/jsonbSchema';

type NumberFieldInputProps = {
  field: NumberField;
  onChange: (config: NumberField['config']) => void;
  onRemove: () => void;
  onTypeChange: (type: Field_Type) => void;
};

const unitPositionOptions = [
  { label: 'front', value: 'front' },
  { label: 'back', value: 'back' },
] satisfies {
  label: string;
  value: NumberField['config']['unitPosition'];
}[];

function NumberFieldInput({
  field,
  onChange,
  onRemove,
  onTypeChange,
}: NumberFieldInputProps) {
  const config = field.config;

  return (
    <FieldInputWrapper
      type={field.type}
      onRemove={onRemove}
      onTypeChange={onTypeChange}
    >
      <TextInput
        id={`${field.id}-title`}
        label='Title'
        value={config.title}
        onChange={(title) => onChange({ ...config, title })}
        placeholder='Number Title (optional)'
      />
      <SwitchInput
        label='Unit'
        description='Show a unit before or after the number.'
        checked={config.isHasUnit}
        onChange={(isHasUnit) => onChange({ ...config, isHasUnit })}
      />
      {config.isHasUnit ? (
        <div className='grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]'>
          <TextInput
            id={`${field.id}-unit`}
            label='Unit label'
            value={config.unit}
            onChange={(unit) => onChange({ ...config, unit })}
            placeholder='e.g. "$", "°C", "hours"'
          />
          <RadioInput
            label='Position'
            value={config.unitPosition}
            onChange={(unitPosition) => onChange({ ...config, unitPosition })}
            options={unitPositionOptions}
          />
        </div>
      ) : null}
    </FieldInputWrapper>
  );
}

export default NumberFieldInput;
