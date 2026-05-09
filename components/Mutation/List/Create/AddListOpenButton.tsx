'use client';

import { Button } from '@headlessui/react';
import { useBoardContext } from '@/components/Board/BoardContext';
import { PlusIcon } from '@/icons/icons';

type AddListButtonProps = { cardId: string };

function AddListOpenButton({ cardId }: AddListButtonProps) {
  const { openAddList } = useBoardContext();

  return (
    <Button
      type='button'
      className='flex items-center gap-2 py-1.5 px-6 rounded-xl text-sm capitalize tracking-wide w-full text-muted-foreground hover:bg-muted/50 hover:text-foreground dark:hover:bg-muted/70 hover:cursor-pointer'
      onClick={() => openAddList(cardId)}
    >
      <PlusIcon className='size-5' />
      add list
    </Button>
  );
}
export default AddListOpenButton;
