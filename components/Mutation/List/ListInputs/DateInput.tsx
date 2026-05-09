import { DateSchema } from '@/types/jsonbSchema';
import { getFieldTitle, ListFieldInputProps } from '.';
import { ListFieldData } from '@/types/app';
import { Field, Fieldset, Input, Label } from '@headlessui/react';

function DateInput({
  field,
  form,
  handleFieldChange,
}: Omit<ListFieldInputProps, 'form'> & { form: ListFieldData<DateSchema> }) {
  const config = field.config as DateSchema['config'];
  const inputType = config.isIncludeTime ? 'datetime-local' : 'date';

  return (
    <li style={{ order: field.position }}>
      <Fieldset>
        <Field className='flex items-center gap-2'>
          <Label className='text-sm font-semibold'>
            {getFieldTitle(field)} :
          </Label>
          <Input
            type={inputType}
            value={form.value}
            onChange={(e) =>
              handleFieldChange(field.id, {
                ...form,
                value: e.target.value,
              })
            }
            className='rounded border-b-2 border-border px-2 py-1 outline-none focus-within:border-b-accent dark:date-picker:invert'
          />
        </Field>
      </Fieldset>
    </li>
  );
}

export default DateInput;
