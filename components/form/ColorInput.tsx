import { Field, Label, Radio, RadioGroup } from '@headlessui/react';
import { colorOptions, ColorPalette } from '@/types/jsonbSchema';
import clsx from 'clsx';

type ColorInputProps = {
  label: string;
  name: string;
  options?: ColorPalette[];
  // Keep this controlled. ERRORS.md documents the Headless UI uncontrolled RadioGroup flushSync warning.
  value: ColorPalette;
  onChange: (value: ColorPalette) => void;
  disabled?: boolean;
  className?: boolean;
};

function getPaletteCSS(color: ColorPalette) {
  return `bg-card-${color}`;
}

function ColorInput({
  label,
  name,
  options = colorOptions,
  value,
  onChange,
  disabled = false,
  className,
}: ColorInputProps) {
  return (
    <RadioGroup
      disabled={disabled}
      name={name}
      value={value}
      onChange={onChange}
      className={clsx('grid gap-2', className)}
    >
      <div className='grid gap-1'>
        <Label className='text-sm font-semibold capitalize'>{label}</Label>
      </div>
      <div className='flex items-center justify-center gap-3 overflow-auto minimal-scrollbar'>
        {options.map((color) => (
          <Field key={color}>
            <Radio
              value={color}
              aria-label={`Palette ${color}`}
              className='group my-1.5 grid size-8 place-items-center rounded-full border border-border bg-muted/40 outline-none transition hover:scale-105 hover:cursor-pointer hover:bg-muted/60 data-checked:border-foreground data-disabled:hover:scale-none data-disabled:hover:cursor-not-allowed data-focus:ring-2 data-focus:ring-accent/70'
            >
              <span className='sr-only'>Palette {color}</span>
              <span
                aria-hidden='true'
                className={`size-8 rounded-full border border-neutral-foreground/15 shadow-sm transition group-data-checked:scale-110 group-data-checked:ring-2 group-data-checked:ring-foreground/30 dark:group-data-checked:ring-foreground ${getPaletteCSS(color)}`}
              />
            </Radio>
          </Field>
        ))}
      </div>
    </RadioGroup>
  );
}

export default ColorInput;
