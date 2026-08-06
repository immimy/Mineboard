'use client';

import { useAppContext } from '@/components/global/AppContext';
import { type DemoHomepageQuery } from '@/gql/__generated__/graphql';
import { XIcon } from '@/icons/icons';
import { Button } from '@headlessui/react';

type DemoSidebarProps = {
  query: DemoHomepageQuery;
  onSelectBoard: (boardId: string) => void;
};

function DemoSidebar({ query, onSelectBoard }: DemoSidebarProps) {
  const { isSidebarOpen, closeSidebar } = useAppContext();
  const boards = query.boardsCollection?.edges ?? [];

  return (
    <aside
      hidden={!isSidebarOpen}
      aria-label='Demo board navigation'
      onClick={closeSidebar}
      className='fixed inset-0 z-60 bg-foreground/35 dark:bg-background/50'
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className='flex h-full w-full max-w-72 flex-col border-r border-border bg-background px-4 py-5 text-foreground shadow-xl'
      >
        {/* Header */}
        <div className='mb-5 flex items-center justify-between gap-3 border-b border-border'>
          <div>
            <h2 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
              Demo boards
            </h2>
            <p className='text-xs text-muted-foreground'>Read-only preview</p>
          </div>

          <Button
            type='button'
            aria-label='Close demo board navigation'
            onClick={closeSidebar}
            className='rounded-md p-1.5 hover:cursor-pointer'
          >
            <XIcon className='size-5 stroke-foreground stroke-2 hover:stroke-accent' />
          </Button>
        </div>

        {/* Board navigation */}
        <nav className='min-h-0 flex-1 overflow-y-auto'>
          <ul className='space-y-2'>
            {boards.map((edge) => {
              const board = edge.node;

              return (
                <li key={board.id}>
                  <Button
                    type='button'
                    onClick={() => {
                      onSelectBoard(board.id);
                      closeSidebar();
                    }}
                    className='block min-h-9 w-full rounded-md border border-transparent px-3 py-2 text-left text-sm font-medium hover:border-border hover:bg-neutral hover:text-neutral-foreground hover:cursor-pointer'
                  >
                    {board.title}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom */}
        <p className='mt-4 border-t border-border pt-4 text-xs leading-5 text-muted-foreground'>
          Sign in to create and modify your own boards.
        </p>
      </div>
    </aside>
  );
}

export default DemoSidebar;
