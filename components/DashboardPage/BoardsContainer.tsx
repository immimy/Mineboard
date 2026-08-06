'use client';

import { AllBoardsQuery, getAllBoardsQueryConfig } from '@/gql/queries';
import Board from './Board';
import { useQuery } from '@apollo/client/react';
import LoadingContainer from '../global/LoadingContainer';
import NoDataFound from '../global/NoDataFound';
import Error from '../global/Error';

type BoardsContainerProps = { userId: string };

function BoardsContainer({ userId }: BoardsContainerProps) {
  const queryConfig = getAllBoardsQueryConfig(userId);
  const { loading, error, data } = useQuery(AllBoardsQuery, {
    variables: queryConfig.variables,
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
