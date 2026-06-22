import { Field, Input, Label } from '@headlessui/react';
import clsx from 'clsx';

type TextInputProps = {
  id: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

function TextInput({
  id,
  label,
  value,
  onChange,
  defaultValue,
  placeholder,
  required = false,
  disabled = false,
  className,
}: TextInputProps) {
  return (
    <Field
      disabled={disabled}
      className={clsx('grid gap-1.5 mb-1.5', className)}
    >
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
  );
}
export default TextInput;
