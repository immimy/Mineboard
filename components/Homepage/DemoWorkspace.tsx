'use client';

import BoardContainer from '@/components/BoardPage/BoardContainer';
import NoDataFound from '@/components/global/NoDataFound';
import { type DemoHomepageQuery } from '@/gql/__generated__/graphql';
import { useState } from 'react';
import DemoSidebar from './DemoSidebar';

type DemoWorkspaceProps = {
  query: DemoHomepageQuery;
};

function DemoWorkspace({ query }: DemoWorkspaceProps) {
  const boards = query.boardsCollection?.edges ?? [];
  const [activeBoardId, setActiveBoardId] = useState(boards[0]?.node.id);
  const activeBoard = boards.find(({ node }) => node.id === activeBoardId);

  if (!activeBoard) return <NoDataFound />;

  const board = activeBoard.node;

  return (
    <>
      {/* Demo Sidebar */}
      <DemoSidebar query={query} onSelectBoard={setActiveBoardId} />

      {/* Board Title */}
      <h1 className='mt-6 truncate text-xl font-semibold tracking-wide text-foreground lg:text-2xl'>
        {board?.title}
      </h1>

      {/* Board Container */}
      <BoardContainer
        boardId={board.id}
        initialListFields={activeBoard.node.list_fieldsCollection}
        initialCards={activeBoard.node.cardsCollection}
        isReadonly
      />
    </>
  );
}

export default DemoWorkspace;
