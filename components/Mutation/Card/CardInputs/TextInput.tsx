import { Field, Fieldset, Input, Label } from '@headlessui/react';
import { useFormStatus } from 'react-dom';

type TextInputProps = {
  id: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
};

function TextInput({
  id,
  label,
  value,
  onChange,
  defaultValue,
  placeholder,
  required = false,
}: TextInputProps) {
  const { pending } = useFormStatus();
  return (
    <Fieldset disabled={pending}>
      <Field className='grid gap-1.5'>
        <Label htmlFor={id} className='text-sm font-semibold capitalize'>
          {label}
        </Label>
        <Input
          id={id}
          name={id}
          type='text'
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          defaultValue={defaultValue}
          className='rounded border-b-2 border-border bg-muted/50 px-2 py-1.5 outline-none transition data-focus:border-accent'
          placeholder={placeholder}
          required={required}
        />
      </Field>
    </Fieldset>
  );
}
export default TextInput;
