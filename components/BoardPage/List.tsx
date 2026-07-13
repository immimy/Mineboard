import { FragmentType, graphql, useFragment } from '@/gql/__generated__';
import ListItemsContainer, { ListValuesFragment } from './ListItemsContainer';
import IconButton from '../Mutation/IconButton';
import { GripVIcon, PencilIcon } from '@/icons/icons';
import { toast } from 'react-toastify';
import { useCardContext } from './CardContext';
import { useUpdateListDialogActions } from '../Mutation/Context/UpdateListDialogContext';

const ListFragment = graphql(/* GraphQL */ `
  fragment List on listsEdge {
    node {
      id
      position
      list_valuesCollection {
        edges {
          node {
            ...ListValues
          }
        }
      }
    }
  }
`);

type ListProps = {
  query: FragmentType<typeof ListFragment>;
};

function List({ query }: ListProps) {
  const { isPreview, title } = useCardContext();
  const { openUpdateList } = useUpdateListDialogActions();

  const list = useFragment(ListFragment, query).node;

  const listItems =
    list.list_valuesCollection?.edges.map(({ node }) => node) ?? [];
  const parsedListItems = useFragment(ListValuesFragment, listItems);
  const formListValues = parsedListItems.map(({ list_fields, value }) => ({
    listFieldId: list_fields!.id,
    value,
  }));

  if (!listItems.length) return null;

  return (
    <li
      style={{ order: list.position }}
      className='relative -mx-2.5 px-3 bg-neutral text-neutral-foreground border border-border dark:border-muted-foreground/40 rounded-xl shadow-2xs'
    >
      {/* List Items */}
      <ListItemsContainer query={listItems} />

      <div className='absolute inset-x-0 top-0 flex justify-between items-center'>
        {/* Grip Button */}
        <IconButton
          disabled={isPreview}
          Icon={GripVIcon}
          label={`Drag list of ${title} ${list.position}`}
          title=''
          onClick={() => toast.info('Drag list action')}
          className='hover:cursor-grab active:cursor-grabbing disabled:pointer-events-none'
        />

        {/* Update List Button */}
        <IconButton
          disabled={isPreview}
          Icon={PencilIcon}
          label={`Update list of ${title} ${list.position}`}
          title={`Update list of ${title}`}
          onClick={() =>
            openUpdateList({
              listId: list.id,
              listValues: formListValues,
            })
          }
          className='[&>svg]:size-3 disabled:pointer-events-none'
        />
      </div>
    </li>
  );
}
export default List;
