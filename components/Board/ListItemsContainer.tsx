'use client';

import { FragmentType, graphql, useFragment } from '@/gql/__generated__';
import renderListField from '../ListField';

const ListValuesFragment = graphql(/* GraphQL */ `
  fragment ListValuesCollection on list_valuesConnection {
    edges {
      node {
        id
        value
        list_fields {
          type
          config
          position
        }
      }
    }
  }
`);

type ListItemsContainerProps = {
  query?: FragmentType<typeof ListValuesFragment> | null;
};

function ListItemsContainer({ query }: ListItemsContainerProps) {
  const listItems = useFragment(ListValuesFragment, query);
  return (
    <ul className='px-4 py-2 grid gap-y-0.5'>
      {listItems?.edges.map((edge) => {
        const { id, value, list_fields } = edge.node;
        const { type, config, position } = list_fields!;

        const listField = {
          config,
          value,
        };

        return renderListField(id, type, listField, position);
      })}
    </ul>
  );
}
export default ListItemsContainer;
