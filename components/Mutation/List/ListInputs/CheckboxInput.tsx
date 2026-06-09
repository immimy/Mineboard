import { CheckboxInput as CheckboxForm } from '@/types/jsonbSchema';
import { ListFieldInputProps } from '.';
import { Checkbox, Field, Fieldset, Input } from '@headlessui/react';
import { CheckmarkIcon } from '@/icons/icons';
import { useFormStatus } from 'react-dom';

function CheckboxInput({
  field,
  form,
  handleFieldChange,
}: Omit<ListFieldInputProps, 'form'> & {
  form: CheckboxForm;
}) {
  const { pending } = useFormStatus();
  return (
    <li style={{ order: field.position }}>
      <Fieldset disabled={pending} className='flex gap-2 items-center'>
        {/* CHECKED */}
        <Field>
          <Checkbox
            checked={form.value.checked}
            onChange={(checked) => {
              const newData = {
                ...form,
                value: { ...form.value, checked },
              };
              handleFieldChange(field.id, newData);
            }}
            className='group block size-5 rounded border border-border bg-background data-checked:bg-accent'
          >
            <CheckmarkIcon className='stroke-neutral opacity-0 group-data-checked:opacity-100' />
          </Checkbox>
        </Field>
        {/* TITLE */}
        <Field className='grow'>
          <Input
            type='text'
            value={form.value.title}
            onChange={(e) => {
              const newData = {
                ...form,
                value: { ...form.value, title: e.target.value },
              };
              handleFieldChange(field.id, newData);
            }}
            placeholder='checklist'
            className='w-full rounded border-b-2 border-border px-2 py-1 outline-none focus:border-accent'
          />
        </Field>
      </Fieldset>
    </li>
  );
}

export default CheckboxInput;
