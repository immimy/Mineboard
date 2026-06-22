'use client';

import { graphql } from '@/gql/__generated__';
import Board from './Board';
import { useQuery } from '@apollo/client/react';
import LoadingContainer from '../global/LoadingContainer';
import NoDataFound from '../global/NoDataFound';
import Error from '../global/Error';

export const AllBoardsQuery = graphql(/* GraphQL */ `
  query AllBoards($userId: UUID!) {
    boardsCollection(
      filter: { user_id: { eq: $userId } }
      orderBy: { created_at: DescNullsLast }
    ) {
      edges {
        node {
          id
        }
        ...Board
      }
    }
  }
`);

type BoardsContainerProps = { userId: string };

function BoardsContainer({ userId }: BoardsContainerProps) {
  const { loading, error, data } = useQuery(AllBoardsQuery, {
    variables: { userId },
  });

  if (loading) return <LoadingContainer />;
  if (error) return <Error />;

  if (!data?.boardsCollection?.edges.length) return <NoDataFound />;

  return (
    <ul className='mt-6 *:mb-3'>
      {data.boardsCollection.edges.map((edge) => (
        <Board key={edge.node.id} query={edge} />
      ))}
    </ul>
  );
}
export default BoardsContainer;
