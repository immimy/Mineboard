import {
  colorOptions,
  ColorPalette,
  TagInput as TagForm,
} from '@/types/jsonbSchema';
import { ListFieldInputProps } from '.';
import {
  Button,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import clsx from 'clsx';
import { useFormStatus } from 'react-dom';

function getDynamicCSS(color: ColorPalette) {
  return {
    tagCSS: `bg-card-${color}/80 text-card-light-${color} dark:bg-card-${color}/90`,
  };
}

function TagsDisplay({
  field,
  form,
  handleFieldChange,
}: Omit<ListFieldInputProps, 'form'> & { form: TagForm }) {
  const { pending } = useFormStatus();

  /** Default tag color */
  const defaultTagCSS = getDynamicCSS(field.config.color);

  /** Feature: Select color for individual tag */
  const updateTagColor = (index: number, color: ColorPalette) => {
    const value = form.value.map((tag, tagIndex) =>
      tagIndex === index ? { ...tag, color } : tag,
    );
    handleFieldChange(field.id, {
      ...form,
      value,
    });
  };

  return (
    <>
      {form.value.map((data, index) => {
        const { tag, color } = data;
        return (
          <Popover key={`${tag}-${index}`} className='relative'>
            {/* TAG DISPLAY */}
            <PopoverButton
              disabled={pending}
              className={clsx(
                'rounded-full px-2 py-0.5 text-xs wrap-break-word max-w-full hover:cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-border focus-within:ring-offset-1',
                color ? getDynamicCSS(color).tagCSS : defaultTagCSS.tagCSS,
              )}
            >
              {tag}
            </PopoverButton>
            {/* COLOR PICKER */}
            <PopoverPanel
              anchor='bottom start'
              className='z-10 mt-2 rounded-3xl border border-border bg-background py-2 px-3 shadow-md dark:shadow-xs dark:shadow-muted-foreground dark:border-0'
            >
              <div className='flex max-w-32 items-center gap-2 touch-pan-x overflow-x-auto overflow-y-hidden pb-1.5 minimal-scrollbar'>
                {colorOptions.map((palette) => (
                  <Button
                    key={`${tag}-${index}-${palette}`}
                    type='button'
                    aria-label={`Set tag color ${palette}`}
                    onClick={() => updateTagColor(index, palette)}
                    className={clsx(
                      'shrink-0 size-6 rounded-full border border-border hover:scale-105 hover:cursor-pointer',
                      getDynamicCSS(palette).tagCSS,
                    )}
                  />
                ))}
              </div>
            </PopoverPanel>
          </Popover>
        );
      })}
    </>
  );
}
export default TagsDisplay;
