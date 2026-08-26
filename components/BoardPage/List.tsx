import { FragmentType, graphql, useFragment } from '@/gql/__generated__';
import ListItemsContainer, { ListValuesFragment } from './ListItemsContainer';
import IconButton from '../Mutation/IconButton';
import { GripVIcon, PencilIcon } from '@/icons/icons';
import { useCardContext } from './CardContext';
import { useUpdateListDialogActions } from '../Mutation/Context/UpdateListDialogContext';
import clsx from 'clsx';
import { DragControls } from '@/types/app';

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
  dragControls?: DragControls;
};

function List({ query, dragControls }: ListProps) {
  const { cardId, title } = useCardContext();
  const { openUpdateList } = useUpdateListDialogActions();

  const list = useFragment(ListFragment, query).node;

  const listItems =
    list.list_valuesCollection?.edges.map(({ node }) => node) ?? [];
  const parsedListItems = useFragment(ListValuesFragment, listItems);
  const displayPosition = dragControls?.index ?? list.position;
  const formListValues = parsedListItems.map(({ list_fields, value }) => ({
    listFieldId: list_fields!.id,
    value,
  }));

  if (!listItems.length) return null;

  return (
    <li
      ref={dragControls?.ref}
      className={clsx(
        'relative -mx-2.5 rounded-xl border border-border bg-neutral px-3 text-neutral-foreground shadow-2xs transition-[opacity,transform,box-shadow] duration-200 dark:border-muted-foreground/40',
        dragControls?.isDragging && 'scale-[0.98] opacity-35',
        dragControls?.isDropTarget &&
          'ring-2 ring-accent ring-offset-1 ring-offset-neutral',
      )}
    >
      {/* List Items */}
      <ListItemsContainer query={listItems} />

      <div className='absolute inset-x-0 top-0 flex justify-between items-center'>
        {/* Grip Button */}
        <IconButton
          ref={dragControls?.handleRef}
          Icon={GripVIcon}
          label={`Drag list ${displayPosition + 1} of ${title}`}
          title=''
          onClick={undefined}
          className='[&>svg]:size-3 touch-none hover:cursor-grab active:cursor-grabbing disabled:pointer-events-none'
        />

        {/* Update List Button */}
        <IconButton
          Icon={PencilIcon}
          label={`Update list ${displayPosition + 1} of ${title}`}
          title={`Update list of ${title}`}
          onClick={() =>
            openUpdateList({
              cardId,
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
