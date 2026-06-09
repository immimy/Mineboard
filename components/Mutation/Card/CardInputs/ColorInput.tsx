import { Field, Fieldset, Label, Radio, RadioGroup } from '@headlessui/react';
import { colorOptions, ColorPalette } from '@/types/jsonbSchema';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

type ColorInputProps = {
  label: string;
  name: string;
  defaultValue?: ColorPalette;
  options?: ColorPalette[];
};

function getPaletteCSS(color: ColorPalette) {
  return `bg-card-${color}`;
}

function ColorInput({
  label,
  name,
  defaultValue = ColorPalette.first,
  options = colorOptions,
}: ColorInputProps) {
  const { pending } = useFormStatus();
  const [value, setValue] = useState(defaultValue);
  return (
    <Fieldset disabled={pending}>
      <RadioGroup
        name={name}
        value={value}
        onChange={setValue}
        defaultValue={defaultValue}
        className='grid gap-2'
      >
        <div className='grid gap-1'>
          <Label className='text-sm font-semibold capitalize'>{label}</Label>
        </div>
        <div className='flex gap-3 justify-center items-center overflow-auto minimal-scrollbar'>
          {options.map((color) => (
            <Field key={color}>
              <Radio
                value={color}
                aria-label={`Palette ${color}`}
                className='my-1.5 group size-8 grid place-items-center rounded-full border border-border bg-muted/40 outline-none transition hover:scale-105 hover:cursor-pointer hover:bg-muted/60 data-checked:border-foreground data-focus:ring-2 data-focus:ring-accent/70'
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
    </Fieldset>
  );
}
export default ColorInput;
