'use client';

import CardContextProvider from './CardContext';
import { ColorPalette } from '@/types/jsonbSchema';
import AddListOpenButton from '@/components/Mutation/List/AddListOpenButton';
import { FragmentType, graphql, useFragment } from '@/gql/__generated__';
import ListsContainer from './ListsContainer';
import { GripVIcon, PencilISquareIcon } from '@/icons/icons';
import { toast } from 'react-toastify';
import IconButton from '../Mutation/IconButton';
import { useUpdateCardDialogActions } from '../Mutation/Context/UpdateCardDialogContext';

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
};

function getDynamicCSS(color: number) {
  return {
    headerCSS: `bg-card-${color}`,
    articleCSS: `border-t-card-${color} bg-card-light-${color}/40 dark:bg-card-light-${color}/80`,
  };
}

function Card({ query, isPreview = false }: CardProps) {
  const { openUpdateCard } = useUpdateCardDialogActions();
  const card = useFragment(CardFragment, query).node;
  const { id: cardId, title, position } = card;
  const color = card.color as ColorPalette;
  const dynamicCSS = getDynamicCSS(color);

  return (
    <article
      className={`p-4 shadow min-h-30 rounded-xl border-t-4 ${dynamicCSS.articleCSS} text-foreground`}
      style={{
        order: position,
      }}
    >
      {/* HEADER */}
      <header className='mb-3 flex items-center gap-1'>
        {/* BUTTON: Grip to drag card */}
        {!isPreview && (
          <IconButton
            Icon={GripVIcon}
            label={`Drag ${title}`}
            title=''
            onClick={() => toast.info('Grip card action')}
            className='shrink-0 hover:cursor-grab active:cursor-grabbing'
          />
        )}

        {/* Card Title */}
        <div className='min-w-0 flex-1 flex items-center gap-x-2 py-2'>
          <span
            className={`size-2.5 shrink-0 rounded-full ${dynamicCSS.headerCSS}`}
          />
          <h6 className='truncate font-bold'>{title}</h6>
        </div>

        {/* BUTTON: open UpdateCardDialog */}
        {!isPreview && (
          <div className='shrink-0 -mr-2 -mt-6 flex items-center'>
            <IconButton
              Icon={PencilISquareIcon}
              label={`Update ${title}`}
              onClick={() => openUpdateCard({ cardId, title, color })}
            />
          </div>
        )}
      </header>

      {/* LISTS */}
      <CardContextProvider isPreview={isPreview} title={title} color={color}>
        <ListsContainer query={card.listsCollection} />
      </CardContextProvider>

      {/* BUTTON: open AddListDialog */}
      {!isPreview && <AddListOpenButton cardId={cardId} />}
    </article>
  );
}
export default Card;
