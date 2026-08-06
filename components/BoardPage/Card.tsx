'use client';

import CardContextProvider from './CardContext';
import { ColorPalette } from '@/types/jsonbSchema';
import AddListOpenButton from '@/components/Mutation/List/AddListOpenButton';
import { FragmentType, graphql, useFragment } from '@/gql/__generated__';
import ListsContainer from './ListsContainer';
import { CheckmarkIcon, GripVIcon, PencilISquareIcon } from '@/icons/icons';
import { toast } from 'react-toastify';
import IconButton from '../Mutation/IconButton';
import { useUpdateCardDialogActions } from '../Mutation/Context/UpdateCardDialogContext';
import { useCardDeletionsContext } from './CardDeletionsContext';
import clsx from 'clsx';

const CardFragment = graphql(/* GraphQL */ `
  fragment Card on cardsEdge {
    node {
      id
      title
      position
      color
      listsCollection(orderBy: [{ position: AscNullsLast }]) {
        ...ListsCollection
      }
    }
  }
`);

type CardProps = {
  query: FragmentType<typeof CardFragment>;
  isPreview?: boolean;
  isReadonly?: boolean;
};

function getDynamicCSS(color: number) {
  return {
    headerCSS: `bg-card-${color}`,
    articleCSS: `border-t-card-${color} bg-card-light-${color}/40 dark:bg-card-light-${color}/80`,
  };
}

function Card({ query, isPreview = false, isReadonly = false }: CardProps) {
  const { openUpdateCard } = useUpdateCardDialogActions();

  const card = useFragment(CardFragment, query).node;
  const { id: cardId, title, position } = card;
  const color = card.color as ColorPalette;
  const dynamicCSS = getDynamicCSS(color);

  return (
    <SelectedAsDeletion cardId={cardId}>
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
        style={{
          order: position,
        }}
      >
        {/* HEADER */}
        <header className='mb-3 flex items-center gap-1'>
          {/* BUTTON: Grip to drag card */}
          <IconButton
            Icon={GripVIcon}
            label={`Drag ${title}`}
            title=''
            onClick={() => toast.info('Grip card action')}
            className='shrink-0 hover:cursor-grab active:cursor-grabbing'
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
          <ListsContainer query={card.listsCollection} />
        </CardContextProvider>

        {/* BUTTON: open AddListDialog */}
        <AddListOpenButton cardId={cardId} />
      </article>
    </SelectedAsDeletion>
  );
}
export default Card;

/**
 * Multiple card deletions wrapper
 */

type SelectedAsDeletionProps = { cardId: string } & React.PropsWithChildren;

function SelectedAsDeletion({ children, cardId }: SelectedAsDeletionProps) {
  const { isDeleteMode, deletedCards, updateDeletedCards } =
    useCardDeletionsContext();
  const isSelected = deletedCards.has(cardId);

  return (
    <div
      onClickCapture={(e) => {
        if (isDeleteMode) {
          updateDeletedCards(cardId);
          e.stopPropagation();
          return;
        }
      }}
      className={clsx(
        isDeleteMode &&
          'relative before:absolute before:inset-0 before:bg-muted/55 before:z-1 before:border-t-4 before:border-muted-foreground/30 before:rounded-xl',
      )}
    >
      {/* CHECKED ICON: Is selected to the deletion? */}
      {isDeleteMode && (
        <span className='absolute top-3 right-3 grid place-items-center z-10 rounded-full p-2 bg-input/70 border border-border drop-shadow-sm dark:drop-shadow-border'>
          <CheckmarkIcon
            className={clsx(
              'stroke-successful/80 size-5',
              isSelected ? 'opacity-100' : 'opacity-0',
            )}
          />
        </span>
      )}
      {children}
    </div>
  );
}
