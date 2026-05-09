import CardContextWrapper from './CardContext';
import { ColorPalette } from '@/types/jsonbSchema';
import AddListOpenButton from '@/components/Mutation/List/Create/AddListOpenButton';
import { FragmentType, graphql, useFragment } from '@/gql/__generated__';
import ListsContainer from './ListsContainer';

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

type CardProps = { query: FragmentType<typeof CardFragment> };

function getDynamicCSS(color: number) {
  return {
    headerCSS: `bg-card-${color}`,
    articleCSS: `border-t-card-${color} bg-card-light-${color}/40 dark:bg-card-light-${color}/80`,
  };
}

function Card({ query }: CardProps) {
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
      {/* TITLE */}
      <header className='px-2 mb-3 flex place-items-center gap-x-2'>
        <span
          className={`size-2.5 inline-block rounded-full ${dynamicCSS.headerCSS}`}
        />
        <h6 className='font-bold'>{title}</h6>
      </header>
      {/* LISTS */}
      <CardContextWrapper color={color}>
        <ListsContainer query={card.listsCollection} />
      </CardContextWrapper>
      {/* BUTTON: open AddListDialog */}
      <AddListOpenButton cardId={cardId} />
    </article>
  );
}
export default Card;
