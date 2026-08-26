'use client';

import CardContextProvider from './CardContext';
import { ColorPalette } from '@/types/jsonbSchema';
import AddListOpenButton from '@/components/Mutation/List/AddListOpenButton';
import {
  FragmentType,
  graphql,
  useFragment as readFragment,
} from '@/gql/__generated__';
import ListsContainer from './ListsContainer';
import { GripVIcon, PencilISquareIcon } from '@/icons/icons';
import { toast } from 'react-toastify';
import IconButton from '../Mutation/IconButton';
import { useUpdateCardDialogActions } from '../Mutation/Context/UpdateCardDialogContext';
import clsx from 'clsx';
import type { ListQuery } from '@/utils/dragdrop/types';
import { useCardSortContext } from './SortableCard';

const CardFragment = graphql(/* GraphQL */ `
  fragment Card on cardsEdge {
    node {
      id
      title
      position
      color
      listsCollection(orderBy: [{ position: AscNullsLast }]) {
        edges {
          node {
            id
          }
          ...List
        }
      }
    }
  }
`);

type CardProps = {
  query: FragmentType<typeof CardFragment>;
  listQueries: ListQuery[];
  isPreview?: boolean;
  isReadonly?: boolean;
};

function getDynamicCSS(color: number) {
  return {
    headerCSS: `bg-card-${color}`,
    articleCSS: `border-t-card-${color} bg-card-light-${color}/40 dark:bg-card-light-${color}/80`,
  };
}

function Card({
  query,
  listQueries,
  isPreview = false,
  isReadonly = false,
}: CardProps) {
  const { openUpdateCard } = useUpdateCardDialogActions();
  const { dragHandleRef, isSortEnabled } = useCardSortContext();

  const card = readFragment(CardFragment, query).node;
  const { id: cardId, title } = card;
  const color = card.color as ColorPalette;
  const dynamicCSS = getDynamicCSS(color);

  return (
    <article
      onClickCapture={(e) => {
        if (!isPreview && !isReadonly) return;

        if (isReadonly)
          toast.info(
            'This is a read-only demo. Sign in to test Mineboard yourself.',
          );

        e.stopPropagation();
      }}
      className={clsx(
        `p-4 shadow min-h-30 rounded-xl border-t-4 ${dynamicCSS.articleCSS} text-foreground`,
      )}
    >
      {/* HEADER */}
      <header className='mb-3 flex items-center gap-1'>
        {/* BUTTON: Grip to drag card */}
        <IconButton
          ref={dragHandleRef}
          Icon={GripVIcon}
          label={`Drag ${title}`}
          title=''
          onClick={undefined}
          size='size-11'
          className='shrink-0 touch-none hover:cursor-grab active:cursor-grabbing'
        />

        {/* Card Title */}
        <div className='min-w-0 flex-1 flex items-center gap-x-2 py-2'>
          <span
            className={`size-2.5 shrink-0 rounded-full ${dynamicCSS.headerCSS}`}
          />
          <h6 className='truncate font-bold'>{title}</h6>
        </div>

        {/* BUTTON: open UpdateCardDialog */}
        <div className='shrink-0 -mr-2 -mt-6 flex items-center'>
          <IconButton
            Icon={PencilISquareIcon}
            label={`Update ${title}`}
            onClick={() => openUpdateCard({ cardId, title, color })}
          />
        </div>
      </header>

      {/* LISTS */}
      <CardContextProvider cardId={cardId} title={title} color={color}>
        <ListsContainer
          listQueries={listQueries}
          isSortEnabled={isSortEnabled}
        />
      </CardContextProvider>

      {/* BUTTON: open AddListDialog */}
      <AddListOpenButton cardId={cardId} />
    </article>
  );
}
export default Card;
