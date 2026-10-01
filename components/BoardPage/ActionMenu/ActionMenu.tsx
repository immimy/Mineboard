import { CaretDownFillIcon } from '@/icons/icons';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { ActionMenuItem } from './ActionMenuContainer';

type ActionMenuProps = {
  actionMenuItems: ActionMenuItem[];
};

function ActionMenu({ actionMenuItems }: ActionMenuProps) {
  return (
    <Menu>
      {/* Menu Trigger Button */}
      <MenuButton
        aria-label='Action menu button'
        className='grid min-h-8 md:min-h-9 place-items-center rounded-r-xl border border-l-0 border-accent/50 bg-accent px-2.5 text-foreground shadow-sm shadow-border/70 transition hover:cursor-pointer hover:bg-accent/90 focus:outline-none data-focus:ring-2 data-focus:ring-accent/50 data-focus:ring-offset-2 data-focus:ring-offset-neutral'
      >
        <CaretDownFillIcon className='size-3 shrink-0 text-foreground/75' />
      </MenuButton>
      {/* Menu list */}
      <MenuItems
        anchor='bottom start'
        className='z-20 mt-2 min-w-56 overflow-hidden rounded-lg border border-border bg-neutral p-1.5 text-neutral-foreground shadow-lg shadow-neutral-foreground/10 outline-none dark:border-muted-foreground/25'
      >
        {actionMenuItems.map(({ id, title, Icon, onAction }) => (
          <MenuItem
            key={id}
            as={Button}
            type='button'
            onClick={onAction}
            className='flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition capitalize hover:cursor-pointer hover:bg-muted hover:text-foreground focus:outline-none data-focus:bg-muted data-focus:text-foreground last:text-destructive last:border-t last:rounded-none last:border-border last:hover:text-destructive'
          >
            <Icon className='size-4 shrink-0' />
            <span>{title}</span>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
export default ActionMenu;
