import { Field_Type } from '@/gql/__generated__/graphql';
import {
  CaretDownFillIcon,
  CaretUpFillIcon,
  GripVIcon,
  TrashIcon,
} from '@/icons/icons';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { Children, ComponentPropsWithoutRef, useId, useState } from 'react';
import { fieldTypeOptions } from '@/types/jsonbSchema';
import clsx from 'clsx';

type FieldInputWrapperProps = {
  type: Field_Type;
  onTypeChange: (type: Field_Type) => void;
  onRemove: () => void;
} & React.PropsWithChildren;

function FieldInputWrapper({
  children,
  type,
  onTypeChange,
  onRemove,
}: FieldInputWrapperProps) {
  const detailsId = useId();
  const [isOpen, setIsOpen] = useState(true);
  const hasContent = Children.count(children) > 0;

  return (
    <article className='rounded border border-border bg-background shadow-xs'>
      {/* Header */}
      <div className='grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 bg-muted/40 px-2 py-1.5'>
        {/* Grip button for dragging the component */}
        <IconButton aria-label={`Drag ${type} field`}>
          <GripVIcon />
        </IconButton>

        <div className='flex min-w-0 items-center gap-2'>
          {/* Type of field heading */}
          <h6 className='truncate text-sm font-semibold text-foreground capitalize'>
            {type}
          </h6>
          {/* Type selection menu */}
          <Menu>
            <MenuButton
              aria-label={`Change ${type} field type`}
              className='rounded border border-border bg-background px-1.5 py-0.5 text-xs font-semibold tracking-tight text-muted-foreground outline-none transition hover:border-accent hover:text-accent data-open:border-accent data-open:text-accent data-focus:ring-2 data-focus:ring-accent/70 uppercase'
            >
              Change
            </MenuButton>
            <MenuItems
              anchor='bottom start'
              className='z-60 grid min-w-36 rounded border border-border bg-background p-1 shadow-lg outline-none'
            >
              {fieldTypeOptions.map((fieldType) => (
                <MenuItem key={fieldType}>
                  <Button
                    type='button'
                    onClick={() => onTypeChange(fieldType)}
                    className='rounded px-3 py-2 text-left text-sm font-medium text-foreground data-focus:bg-muted data-focus:text-accent capitalize'
                  >
                    {fieldType}
                  </Button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>

        <div className='flex items-center gap-1'>
          {/* Expand/Collapse trigger button */}
          {hasContent ? (
            <IconButton
              aria-controls={detailsId}
              aria-expanded={isOpen}
              aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${type} field details`}
              onClick={() => setIsOpen((currentValue) => !currentValue)}
            >
              {isOpen ? <CaretDownFillIcon /> : <CaretUpFillIcon />}
            </IconButton>
          ) : null}
          {/* Remove field button */}
          <IconButton aria-label={`Remove ${type} field`} onClick={onRemove}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      {/* Content */}
      {hasContent && isOpen ? (
        <div id={detailsId} className='grid gap-4 p-4'>
          {children}
        </div>
      ) : null}
    </article>
  );
}

export default FieldInputWrapper;

function IconButton({
  children,
  className,
  type = 'button',
  ...props
}: ComponentPropsWithoutRef<typeof Button>) {
  return (
    <Button
      type={type}
      {...props}
      className={clsx(
        'grid size-11 shrink-0 place-items-center rounded border border-transparent text-muted-foreground outline-none transition hover:bg-muted hover:text-foreground data-open:bg-muted data-open:text-foreground data-focus:ring-2 data-focus:ring-accent/70',
        className,
      )}
    >
      {children}
    </Button>
  );
}
