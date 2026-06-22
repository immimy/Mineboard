import { Label, Radio, RadioGroup } from '@headlessui/react';
import clsx from 'clsx';

type RadioOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type RadioInputProps<TValue extends string> = {
  label: string;
  name?: string;
  options: RadioOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  disabled?: boolean;
  className?: string;
};

function RadioInput<TValue extends string>({
  label,
  name,
  options,
  value,
  onChange,
  disabled = false,
  className,
}: RadioInputProps<TValue>) {
  return (
    <RadioGroup
      disabled={disabled}
      name={name}
      value={value}
      onChange={onChange}
      className={clsx('grid gap-1.5', className)}
    >
      <Label className='text-sm font-semibold text-foreground'>{label}</Label>
      <div className='grid grid-cols-2 rounded border border-border bg-muted p-1'>
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            className='grid place-items-center min-h-10 rounded px-4 text-sm font-semibold capitalize text-muted-foreground outline-none data-checked:bg-background data-checked:text-accent data-disabled:cursor-not-allowed data-disabled:opacity-70 data-focus:ring-2 data-focus:ring-accent/70'
          >
            <span className='pointer-events-none'>{option.label}</span>
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
}

export default RadioInput;
