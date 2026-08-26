'use client';

import type { ListQuery } from '@/utils/dragdrop/types';
import List from './List';
import SortableList from './SortableList';

type ListsContainerProps = {
  listQueries: ListQuery[];
  isSortEnabled?: boolean;
};

function ListsContainer({
  listQueries,
  isSortEnabled = false,
}: ListsContainerProps) {
  return (
    <ul className='mb-3 flex min-h-3 flex-col gap-3'>
      {listQueries.map((edge, index) =>
        isSortEnabled ? (
          <SortableList
            key={edge.node.id}
            id={edge.node.id}
            index={index}
            query={edge}
          />
        ) : (
          <List key={edge.node.id} query={edge} />
        ),
      )}
    </ul>
  );
}
export default ListsContainer;
