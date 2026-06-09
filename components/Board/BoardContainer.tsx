'use client';

import { useQuery } from '@apollo/client/react';
import BoardContextWrapper from './BoardContext';
import AddListDialog from '../Mutation/List/Create/AddListDialog';
import AddCardDialog from '../Mutation/Card/Create/AddCardDialog';
import LoadingContainer from '../global/LoadingContainer';
import NoDataFound from '../global/NoDataFound';
import { graphql } from '@/gql/__generated__';
import BoardHeader from './BoardHeader';
import Error from '../global/Error';
import CardsContainer from './CardsContainer';

const SingleBoardQuery = graphql(/* GraphQL */ `
  query SingleBoard($boardId: UUID!) {
    # Board
    boardsCollection(filter: { id: { eq: $boardId } }) {
      edges {
        ...Board
      }
    }
    # List Fields
    list_fieldsCollection(
      filter: { board_id: { eq: $boardId } }
      orderBy: [{ position: AscNullsLast }]
    ) {
      ...ListFieldsCollection
    }
    # Cards
    cardsCollection(
      filter: { board_id: { eq: $boardId } }
      orderBy: [{ position: AscNullsLast }]
    ) {
      ...CardsCollection
    }
  }
`);

type BoardContainerProps = {
  boardId: string;
};

function BoardContainer({ boardId }: BoardContainerProps) {
  const { loading, error, data } = useQuery(SingleBoardQuery, {
    variables: { boardId },
  });

  if (loading) return <LoadingContainer />;
  if (error) return <Error />;

  if (!data || !data?.boardsCollection?.edges.length) return <NoDataFound />;

  return (
    <BoardContextWrapper
      boardId={boardId}
      queryListFields={data.list_fieldsCollection}
    >
      {/* BOARD HEADER */}
      <BoardHeader query={data.boardsCollection.edges[0]} />
      {/* CARDS */}
      <CardsContainer query={data.cardsCollection} />
      {/* ADD CARD DIALOG */}
      <AddCardDialog />
      {/* ADD LIST DIALOG */}
      <AddListDialog />
    </BoardContextWrapper>
  );
}
export default BoardContainer;
