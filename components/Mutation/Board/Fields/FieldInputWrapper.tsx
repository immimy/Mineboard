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
import { Children, useId, useState } from 'react';
import { fieldTypeOptions } from '@/types/jsonbSchema';
import clsx from 'clsx';
import { useSortable } from '@dnd-kit/react/sortable';
import { ListFieldForm } from '@/types/app';
import IconButton from '@/components/Mutation/IconButton';

type FieldInputWrapperProps = {
  field: Pick<ListFieldForm, 'id' | 'position' | 'type'>;
  onTypeChange: (type: Field_Type) => void;
  onRemove: () => void;
} & React.PropsWithChildren;

function FieldInputWrapper({
  children,
  field,
  onTypeChange,
  onRemove,
}: FieldInputWrapperProps) {
  const { id, position, type } = field;
  const detailsId = useId();
  const [isOpen, setIsOpen] = useState(true);
  const hasContent = Children.count(children) > 0;
  const { ref, handleRef, isDragging, isDropTarget } = useSortable({
    id,
    index: position,
    group: 'list-fields',
    type: 'list-field',
    accept: 'list-field',
  });

  return (
    <article
      ref={ref}
      className={clsx(
        'rounded border border-border bg-background shadow-xs transition-[opacity,transform,box-shadow] duration-200',
        isDragging && 'scale-[0.99] opacity-40',
        isDropTarget && 'ring-2 ring-accent/80',
      )}
    >
      {/* Header */}
      <div className='grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 bg-muted/40 px-2 py-1.5'>
        {/* Grip button for dragging the component */}
        <IconButton
          ref={handleRef}
          Icon={GripVIcon}
          label={`Drag ${type} field`}
          onClick={undefined}
          size='size-11'
          className='touch-none hover:cursor-grab active:cursor-grabbing'
        />

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
          {hasContent && (
            <IconButton
              aria-controls={detailsId}
              aria-expanded={isOpen}
              Icon={isOpen ? CaretUpFillIcon : CaretDownFillIcon}
              label={`${isOpen ? 'Collapse' : 'Expand'} ${type} field details`}
              onClick={() => setIsOpen((currentValue) => !currentValue)}
              size='size-11'
            />
          )}
          {/* Remove field button */}
          <IconButton
            Icon={TrashIcon}
            label={`Remove ${type} field`}
            onClick={onRemove}
            size='size-11'
          />
        </div>
      </div>

      {/* Content */}
      {hasContent && isOpen && (
        <div id={detailsId} className='grid gap-4 p-4'>
          {children}
        </div>
      )}
    </article>
  );
}

export default FieldInputWrapper;
