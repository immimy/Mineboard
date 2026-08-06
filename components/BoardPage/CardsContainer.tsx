'use client';

import { FragmentType, graphql, useFragment } from '@/gql/__generated__';
import Card from './Card';

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
  const cards = useFragment(CardsCollectionFragment, query);
  return (
    <section className='mt-3 grid grid-cols-1 items-start gap-3 md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))]'>
      {cards?.edges.map((edge) => {
        return <Card key={edge.node.id} query={edge} isReadonly={isReadonly} />;
      })}
    </section>
  );
}
export default CardsContainer;
