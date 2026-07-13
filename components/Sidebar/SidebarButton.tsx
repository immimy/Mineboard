'use client';

import { useAppContext } from '@/components/global/AppContext';
import { SidebarIcon } from '@/icons/icons';
import { Button } from '@headlessui/react';

function SidebarButton() {
  const { openSidebar } = useAppContext();
  return (
    <Button
      type='button'
      className='shrink-0 p-2 rounded-xl hover:bg-muted-foreground/10 dark:hover:bg-muted-foreground/30 hover:cursor-pointer hover:shadow hover:shadow-border/40'
      onClick={openSidebar}
    >
      <SidebarIcon className='stroke-accent size-5' />
    </Button>
  );
}
export default SidebarButton;
