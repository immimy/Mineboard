'use client';

import { FragmentType, graphql, useFragment } from '@/gql/__generated__';
import List from './List';

const ListsCollectionFragment = graphql(/* GraphQL */ `
  fragment ListsCollection on listsConnection {
    edges {
      node {
        id
      }
      ...List
    }
  }
`);

type ListsContainerProps = {
  query?: FragmentType<typeof ListsCollectionFragment> | null;
};

function ListsContainer({ query }: ListsContainerProps) {
  const lists = useFragment(ListsCollectionFragment, query);
  return (
    <ul className='mb-3 flex flex-col gap-3'>
      {lists?.edges?.map((edge) => {
        return <List key={edge.node.id} query={edge} />;
      })}
    </ul>
  );
}
export default ListsContainer;
