import { Description, Field, Label, Switch } from '@headlessui/react';
import clsx from 'clsx';

type SwitchInputProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

function SwitchInput({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className,
}: SwitchInputProps) {
  return (
    <Field
      disabled={disabled}
      className={clsx(
        'flex items-center justify-between gap-3 rounded border border-border bg-muted/30 px-3 py-2',
        className,
      )}
    >
      <div>
        <Label className='text-sm font-semibold text-foreground'>{label}</Label>
        {description ? (
          <Description className='text-xs text-muted-foreground'>
            {description}
          </Description>
        ) : null}
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        className='group inline-flex h-7 w-12 items-center rounded-full border border-border bg-muted transition data-checked:bg-accent data-disabled:cursor-not-allowed data-disabled:opacity-70'
      >
        <span className='size-5 translate-x-1 rounded-full bg-background shadow transition group-data-checked:translate-x-6' />
      </Switch>
    </Field>
  );
}

export default SwitchInput;
