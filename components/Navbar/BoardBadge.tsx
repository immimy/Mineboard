'use client';

import { BoardTitleQuery, getBoardTitleQueryConfig } from '@/gql/queries';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { NavbarBadge as LoadingSkeleton } from '../Skeleton/Button';
import { useQuery } from '@apollo/client/react';
import Error from '../global/Error';
import UpdateBoardTitle from '../Mutation/Board/Title/UpdateBoardTitle';

function BoardBadgeComponent() {
  const pathname = usePathname();
  const regex = /^\/dashboard\/[^/]+\/?$/;
  const isBoardPage = regex.test(pathname);

  return isBoardPage ? <BoardTitle /> : <HomepageLink />;
}

function BoardTitle() {
  const { id: boardId } = useParams();
  const queryConfig = getBoardTitleQueryConfig(boardId as string);
  const { loading, error, data } = useQuery(BoardTitleQuery, {
    variables: queryConfig.variables,
  });

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <Error isMarginTop={false} />;

  const title = data.boardsCollection?.edges[0].node.title;
  if (!title) return null;
  return <UpdateBoardTitle boardId={boardId as string} title={title} />;
}

function HomepageLink() {
  return (
    <Link
      href='/'
      className='uppercase tracking-wider font-semibold lg:text-xl'
    >
      Mineboard
    </Link>
  );
}

function BoardBadge() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <BoardBadgeComponent />
    </Suspense>
  );
}
export default BoardBadge;
