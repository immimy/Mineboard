'use client';

import { useAppContext } from '@/components/global/AppContext';
import { BoardFragment } from '@/components/DashboardPage/Board';
import { AllBoardsQuery, getAllBoardsQueryConfig } from '@/gql/queries';
import AddBoardTitle, {
  PendingBoard,
} from '@/components/Mutation/Board/Title/AddBoardTitle';
import Error from '@/components/global/Error';
import { Loading } from '@/components/global/LoadingContainer';
import { useFragment as readFragment } from '@/gql/__generated__';
import { LoadingIcon, XIcon } from '@/icons/icons';
import { useQuery } from '@apollo/client/react';
import { Button } from '@headlessui/react';
import Link from 'next/link';
import { useState } from 'react';

type DashboardSidebarProps = { userId: string };

function DashboardSidebar({ userId }: DashboardSidebarProps) {
  const { isSidebarOpen, closeSidebar } = useAppContext();

  const [pendingBoards, setPendingBoards] = useState<PendingBoard[]>([]);

  const queryConfig = getAllBoardsQueryConfig(userId);
  const { loading, error, data } = useQuery(AllBoardsQuery, {
    variables: queryConfig.variables,
  });

  const boards = data?.boardsCollection?.edges ?? [];
  const hasBoards = pendingBoards.length > 0 || boards.length > 0;

  return (
    <aside
      hidden={!isSidebarOpen}
      aria-label='Board navigation'
      onClick={closeSidebar}
      className='fixed inset-0 z-60 bg-foreground/35 dark:bg-background/50'
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='flex h-full w-full max-w-72 flex-col border-r border-border bg-background px-4 py-5 text-foreground shadow-xl'
      >
        {/* Header */}
        <div className='mb-5 flex items-center justify-between gap-3 border-b border-border'>
          <h2 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
            Boards
          </h2>

          <Button
            type='button'
            onClick={closeSidebar}
            className='rounded-md p-1.5 hover:cursor-pointer'
          >
            <XIcon className='size-5 stroke-foreground stroke-2 hover:stroke-accent' />
          </Button>
        </div>

        {/* Board navigation */}
        <nav className='min-h-0 flex-1 overflow-y-auto'>
          {loading ? (
            <div className='py-8'>
              <Loading size='size-5' />
            </div>
          ) : error ? (
            <Error isMarginTop={false} />
          ) : hasBoards ? (
            <ul className='space-y-2'>
              {/* Pending boards */}
              {pendingBoards.map((board) => (
                <li key={board.id}>
                  <div className='flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-muted-foreground'>
                    <span className='min-w-0 truncate'>{board.title}</span>
                    <LoadingIcon className='size-3.5' />
                  </div>
                </li>
              ))}

              {/* Board title list */}
              {boards.map((edge) => {
                const board = readFragment(BoardFragment, edge).node;

                return (
                  <li key={board.id}>
                    <Link
                      href={`/dashboard/${board.id}`}
                      onClick={closeSidebar}
                      className='block rounded-md border border-transparent px-3 py-2 text-sm font-medium hover:border-border hover:bg-neutral hover:text-neutral-foreground'
                    >
                      {board.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className='px-3 py-2 text-sm text-muted-foreground'>
              No boards yet
            </p>
          )}
        </nav>

        {/* Add boards */}
        <AddBoardTitle
          userId={userId}
          isDisabled={loading}
          setPendingBoards={setPendingBoards}
        />
      </div>
    </aside>
  );
}
export default DashboardSidebar;
