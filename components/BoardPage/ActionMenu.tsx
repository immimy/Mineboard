import { CaretDownFillIcon } from '@/icons/icons';
import type { ActionMenuId } from '@/types/app';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import clsx from 'clsx';
import { ActionMenuItem } from './ActionMenuContainer';

type ActionMenuProps = {
  actionMenuItems: ActionMenuItem[];
  activeActionId: ActionMenuId;
  onSelectAction: (actionId: ActionMenuId) => void;
};

function ActionMenu({
  actionMenuItems,
  activeActionId,
  onSelectAction,
}: ActionMenuProps) {
  return (
    <Menu>
      {/* Menu Trigger Button */}
      <MenuButton className='grid min-h-8 md:min-h-9 place-items-center rounded-r-xl border border-l-0 border-accent/50 bg-accent px-2.5 text-foreground shadow-sm shadow-border/70 transition hover:cursor-pointer hover:bg-accent/90 focus:outline-none data-focus:ring-2 data-focus:ring-accent/50 data-focus:ring-offset-2 data-focus:ring-offset-neutral'>
        <CaretDownFillIcon className='size-3 shrink-0 text-foreground/75' />
      </MenuButton>
      {/* Menu list */}
      <MenuItems
        anchor='bottom start'
        className='z-20 mt-2 min-w-56 overflow-hidden rounded-lg border border-border bg-neutral p-1.5 text-neutral-foreground shadow-lg shadow-neutral-foreground/10 outline-none dark:border-muted-foreground/25'
      >
        {actionMenuItems.map((item) => (
          <MenuItem key={item.id}>
            <ActionMenuItemButton
              menuItem={item}
              isActive={item.id === activeActionId}
              onClick={() => onSelectAction(item.id)}
            />
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
export default ActionMenu;

function ActionMenuItemButton({
  menuItem,
  isActive,
  onClick,
}: {
  menuItem: ActionMenuItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const { title, Icon } = menuItem;

  return (
    <Button
      onClick={onClick}
      className='flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition hover:cursor-pointer hover:bg-muted hover:text-foreground focus:outline-none data-focus:bg-muted data-focus:text-foreground'
    >
      <Icon
        className={clsx(
          'size-4 shrink-0',
          `${isActive ? 'text-accent' : 'text-muted-foreground'}`,
        )}
      />
      <span>{title}</span>
    </Button>
  );
}
