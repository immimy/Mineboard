import { CheckmarkIcon } from '@/icons/icons';
import { Checkbox, Field, Label } from '@headlessui/react';
import { useCardContext } from '../Board/CardContext';
import { CheckboxSchema, ColorPalette } from '@/types/jsonbSchema';
import { ListFieldProps } from '.';

function getDynamicCSS(color: ColorPalette) {
  return {
    checkboxCSS: `data-checked:bg-card-${color}`,
    checkmarkCSS: `stroke-card-light-${color}`,
  };
}

function CheckboxField({ data, position }: ListFieldProps<CheckboxSchema>) {
  const { checked, title } = data.value;
  const { color } = useCardContext();
  const dynamicCSS = getDynamicCSS(color);

  return (
    <li style={{ order: position }}>
      <Field className='flex items-center gap-2'>
        <Checkbox
          checked={checked}
          disabled
          className={`peer group block size-4 rounded border border-border bg-background ${dynamicCSS.checkboxCSS}`}
        >
          <CheckmarkIcon
            className={`${dynamicCSS.checkmarkCSS} opacity-0 group-data-checked:opacity-100`}
          />
        </Checkbox>
        <Label passive className='peer-data-checked:line-through'>
          {title}
        </Label>
      </Field>
    </li>
  );
}
export default CheckboxField;
