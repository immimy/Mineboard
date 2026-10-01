'use client';

import {
  FragmentType,
  graphql,
  useFragment as readFragment,
} from '@/gql/__generated__';
import { createBoardData } from '@/utils/dragdrop/helper';
import { useMemo } from 'react';
import BoardDragDropArea from '../Board/BoardDragDropArea';
import CardsGrid from './CardsGrid';
import { useBoardContext } from '../Board/BoardContext';

const CardsCollectionFragment = graphql(/* GraphQL */ `
  fragment CardsCollection on cardsConnection {
    edges {
      node {
        id
      }
      ...Card
    }
  }
`);

type CardsContainerProps = {
  query?: FragmentType<typeof CardsCollectionFragment> | null;
  isReadonly?: boolean;
};

function CardsContainer({ query, isReadonly = false }: CardsContainerProps) {
  const { boardId } = useBoardContext();
  const cards = readFragment(CardsCollectionFragment, query);
  // Converts server data into the DnD-friendly shape
  const serverData = useMemo(() => createBoardData(cards), [cards]);

  return (
    <BoardDragDropArea key={boardId} serverLayout={serverData.layout}>
      {(layout, isDragging) => (
        <CardsGrid
          layout={layout}
          serverData={serverData}
          isDragging={isDragging}
          isReadonly={isReadonly}
        />
      )}
    </BoardDragDropArea>
  );
}
export default CardsContainer;
