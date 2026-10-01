'use client';

import clsx from 'clsx';
import type { ListQuery } from '@/utils/dragdrop/types';
import List from './List';
import SortableList from './SortableList';

type ListsContainerProps = {
  id?: string;
  listQueries: ListQuery[];
  isInert?: boolean;
  isSortEnabled?: boolean;
};

function ListsContainer({
  id,
  listQueries,
  isInert = false,
  isSortEnabled = false,
}: ListsContainerProps) {
  return (
    <ul
      id={id}
      inert={isInert ? true : undefined}
      aria-hidden={isInert || undefined}
      className={clsx(
        'flex min-h-3 flex-col gap-3',
        listQueries.length && 'mb-3',
        isInert && 'pointer-events-none select-none',
      )}
    >
      {listQueries.map((edge, index) =>
        isSortEnabled ? (
          <SortableList
            key={edge.node.id}
            id={edge.node.id}
            index={index}
            isInert={isInert}
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
