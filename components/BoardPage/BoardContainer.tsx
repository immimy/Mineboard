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
import { getSingleBoardQueryConfig, SingleBoardQuery } from '@/gql/queries';
import BoardHeader from './BoardHeader';
import Error from '../global/Error';
import CardsContainer from './CardsContainer';
import ListFieldDialog from '../Mutation/Board/ListField/ListFieldDialog';
import NoCardsDisplay from './NoCardsDisplay';
import CardDeletionsProvider from './CardDeletionsContext';
import type { FragmentType } from '@/gql/__generated__';
import {
  CardsCollectionFragmentDoc,
  ListFieldsCollectionFragmentDoc,
} from '@/gql/__generated__/graphql';

type BoardContainerProps = {
  boardId: string;
  userId?: string;
  initialListFields?: FragmentType<
    typeof ListFieldsCollectionFragmentDoc
  > | null;
  initialCards?: FragmentType<typeof CardsCollectionFragmentDoc> | null;
  isReadonly?: boolean;
};

function BoardContainer({
  boardId,
  userId,
  initialListFields,
  initialCards,
  isReadonly = false,
}: BoardContainerProps) {
  const hasInitialData =
    initialListFields !== undefined && initialCards !== undefined;
  const queryConfig = getSingleBoardQueryConfig(boardId);

  // Fetch single board data (skip if there is initial value)
  const { loading, error, data } = useQuery(SingleBoardQuery, {
    variables: queryConfig.variables,
    skip: hasInitialData,
  });

  const listFields = hasInitialData
    ? initialListFields
    : data?.list_fieldsCollection;
  const cards = hasInitialData ? initialCards : data?.cardsCollection;

  if (!hasInitialData && loading) return <LoadingContainer />;
  if (error) return <Error />;
  if (!hasInitialData && !data?.boardsCollection?.edges.length) {
    return <NoDataFound />;
  }

  return (
    <BoardContextProvider
      boardId={boardId}
      userId={userId}
      queryListFields={listFields}
    >
      <CardDeletionsProvider>
        <DialogsProvider>
          {/* Board Header */}
          {!isReadonly && <BoardHeader />}

          {/* Cards container */}
          {/* Without Cards */}
          <NoCardsDisplay
            cardsQuery={cards}
            listFieldsQuery={listFields}
            isReadonly={isReadonly}
          />
          {/* With Cards */}
          <CardsContainer query={cards} isReadonly={isReadonly} />

          {/* Dialogs */}
          {!isReadonly && (
            <>
              {/* List Field: Create&Update Feature */}
              <ListFieldDialog />
              {/* Add Feature */}
              <AddCardDialog />
              <AddListDialog />
              {/* Update Feature */}
              <UpdateCardDialog />
              <UpdateListDialog />
            </>
          )}
        </DialogsProvider>
      </CardDeletionsProvider>
    </BoardContextProvider>
  );
}
export default BoardContainer;
