'use client';

import { graphql } from '@/gql/__generated__';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { NavbarBadge as LoadingSkeleton } from '../Skeleton/Button';
import { useQuery } from '@apollo/client/react';
import Error from '../global/Error';
import UpdateBoardTitle from '../Mutation/Board/Title/UpdateBoardTitle';

const BoardTitleQuery = graphql(/* GraphQL */ `
  query BoardTitle($boardId: UUID!) {
    boardsCollection(filter: { id: { eq: $boardId } }) {
      edges {
        ...Board @unmask
      }
    }
  }
`);

function BoardBadgeComponent() {
  const pathname = usePathname();
  const regex = /(^\/(\?.*)?$)|(^\/dashboard(\?.*)?)$/;
  const isLanding = regex.test(pathname);
  if (isLanding) return <HomepageLink />;
  // CAVEATS: All paths unless landing page return this board title.
  // If there are more routes in the future, this should be reviewed further.
  return <BoardTitle />;
}

function BoardTitle() {
  const { id: boardId } = useParams();
  const { loading, error, data } = useQuery(BoardTitleQuery, {
    variables: { boardId: boardId as string },
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
