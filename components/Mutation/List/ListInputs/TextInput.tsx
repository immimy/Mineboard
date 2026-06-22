import { TextInput as TextForm } from '@/types/jsonbSchema';
import { getFieldTitle, ListFieldInputProps } from '.';
import { Field, Label, Textarea } from '@headlessui/react';

function TextInput({
  field,
  form,
  handleFieldChange,
}: Omit<ListFieldInputProps, 'form'> & { form: TextForm }) {
  return (
    <li style={{ order: field.position }}>
      <Field>
        <Label className='text-sm font-semibold block mb-2 border-b border-border'>
          {getFieldTitle(field)}
        </Label>
        <div className='px-2'>
          <Textarea
            rows={3}
            value={form.value}
            onChange={(event) =>
              handleFieldChange(field.id, {
                ...form,
                value: event.target.value,
              })
            }
            placeholder='Type here...'
            className='w-full rounded border-b-2 border-border bg-background px-2 py-1 outline-none focus:border-accent'
          />
        </div>
      </Field>
    </li>
  );
}

export default TextInput;
