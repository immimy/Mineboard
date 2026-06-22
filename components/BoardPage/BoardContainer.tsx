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
import AddListFieldDialog from '../Mutation/Board/Create/AddListFieldDialog';
import NoCardsDisplay from './NoCardsDisplay';

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
      {/* Board Header */}
      <BoardHeader />
      {/* Without Cards */}
      <NoCardsDisplay
        cardsQuery={data.cardsCollection}
        listFieldsQuery={data.list_fieldsCollection}
      />
      {/* With Cards */}
      <CardsContainer query={data.cardsCollection} />
      {/* Add List Field Dialog */}
      <AddListFieldDialog />
      {/* Add Card Dialog */}
      <AddCardDialog />
      {/* Add List Dialog */}
      <AddListDialog />
    </BoardContextWrapper>
  );
}
export default BoardContainer;
