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
};

function CardsContainer({ query }: CardsContainerProps) {
  const cards = useFragment(CardsCollectionFragment, query);
  return (
    <section className='mt-3 grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-3 items-start'>
      {cards?.edges.map((edge) => {
        return <Card key={edge.node.id} query={edge} />;
      })}
    </section>
  );
}
export default CardsContainer;
