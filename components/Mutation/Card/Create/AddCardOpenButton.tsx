'use client';

import { Button } from '@headlessui/react';
import { useBoardContext } from '@/components/Board/BoardContext';
import { PlusIcon } from '@/icons/icons';

function AddCardOpenButton() {
  const { openAddCard } = useBoardContext();

  return (
    <Button
      type='button'
      className='py-1.5 px-3 rounded-xl bg-background text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted hover:cursor-pointer pointer-events-auto'
      onClick={openAddCard}
    >
      <div className='flex justify-center items-center gap-1.5'>
        <PlusIcon className='size-5' />
        <span className='capitalize text-sm'>add card</span>
      </div>
    </Button>
  );
}
export default AddCardOpenButton;
