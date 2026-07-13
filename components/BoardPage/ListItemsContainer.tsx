'use client';

import { FragmentType, graphql, useFragment } from '@/gql/__generated__';
import renderListField from '../ListField';

export const ListValuesFragment = graphql(/* GraphQL */ `
  fragment ListValues on list_values {
    id
    value
    list_fields {
      id
      type
      config
      position
    }
  }
`);

type ListItemsContainerProps = {
  query?: FragmentType<typeof ListValuesFragment>[] | null;
};

function ListItemsContainer({ query }: ListItemsContainerProps) {
  const listItems = useFragment(ListValuesFragment, query);
  return (
    <ul className='px-4 py-2 flex flex-col gap-y-0.5'>
      {listItems?.map((listItem) => {
        const { id, value, list_fields } = listItem;
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
