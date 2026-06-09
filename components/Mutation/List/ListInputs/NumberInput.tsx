import { NumberInput as NumberForm, NumberSchema } from '@/types/jsonbSchema';
import { getFieldTitle, ListFieldInputProps } from '.';
import { Field, Fieldset, Input, Label } from '@headlessui/react';
import { useFormStatus } from 'react-dom';

function NumberInput({
  field,
  form,
  handleFieldChange,
}: Omit<ListFieldInputProps, 'form'> & { form: NumberForm }) {
  const { pending } = useFormStatus();
  const config = field.config as NumberSchema['config'];

  return (
    <li style={{ order: field.position }}>
      <Fieldset disabled={pending}>
        <Field className='flex items-center gap-2'>
          {/* LABEL */}
          <Label className='text-sm font-semibold'>
            {getFieldTitle(field)} :
          </Label>
          {/* INPUT */}
          <div className='flex items-center gap-2'>
            {/* FRONT UNIT */}
            {config.isHasUnit && config.unitPosition === 'front' ? (
              <span className='text-sm font-medium'>{config.unit}</span>
            ) : null}
            {/* NUMBER INPUT */}
            <Input
              type='number'
              inputMode='decimal'
              value={form.value}
              onChange={(e) =>
                handleFieldChange(field.id, {
                  ...form,
                  value: e.target.value,
                })
              }
              className='w-full rounded border-b-2 border-border px-2 py-1 outline-none focus:border-accent'
            />
            {/* BACK UNIT */}
            {config.isHasUnit && config.unitPosition === 'back' ? (
              <span className='text-sm font-medium'>{config.unit}</span>
            ) : null}
          </div>
        </Field>
      </Fieldset>
    </li>
  );
}

export default NumberInput;
