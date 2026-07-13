'use client';

import { useQuery } from '@apollo/client/react';
import BoardContextProvider from './BoardContext';
import DialogsProvider from '../Mutation/Context/DialogsProvider';
import AddListDialog from '../Mutation/List/AddListDialog';
import AddCardDialog from '../Mutation/Card/AddCardDialog';
import UpdateCardDialog from '../Mutation/Card/UpdateCardDialog';
import UpdateListDialog from '../Mutation/List/UpdateListDialog';
import LoadingContainer from '../global/LoadingContainer';
import NoDataFound from '../global/NoDataFound';
import { graphql } from '@/gql/__generated__';
import BoardHeader from './BoardHeader';
import Error from '../global/Error';
import CardsContainer from './CardsContainer';
import ListFieldDialog from '../Mutation/Board/ListField/ListFieldDialog';
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
    <BoardContextProvider
      boardId={boardId}
      queryListFields={data.list_fieldsCollection}
    >
      <DialogsProvider>
        {/* Board Header */}
        <BoardHeader />

        {/* Cards container */}
        {/* Without Cards */}
        <NoCardsDisplay
          cardsQuery={data.cardsCollection}
          listFieldsQuery={data.list_fieldsCollection}
        />
        {/* With Cards */}
        <CardsContainer query={data.cardsCollection} />

        {/* Dialogs */}
        {/* List Field: Create&Update Feature */}
        <ListFieldDialog />
        {/* Add Feature */}
        <AddCardDialog />
        <AddListDialog />
        {/* Update Feature */}
        <UpdateCardDialog />
        <UpdateListDialog />
      </DialogsProvider>
    </BoardContextProvider>
  );
}
export default BoardContainer;
