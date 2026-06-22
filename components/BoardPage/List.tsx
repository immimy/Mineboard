import { FragmentType, graphql, useFragment } from '@/gql/__generated__';
import ListItemsContainer from './ListItemsContainer';

const ListFragment = graphql(/* GraphQL */ `
  fragment List on listsEdge {
    node {
      id
      position
      list_valuesCollection {
        ...ListValuesCollection
      }
    }
  }
`);

type ListProps = {
  query: FragmentType<typeof ListFragment>;
};

function List({ query }: ListProps) {
  const list = useFragment(ListFragment, query).node;

  return (
    <li
      style={{ order: list.position }}
      className='bg-neutral text-neutral-foreground border border-border dark:border-muted-foreground/40 rounded-xl shadow-2xs'
    >
      <ListItemsContainer query={list.list_valuesCollection} />
    </li>
  );
}
export default List;
