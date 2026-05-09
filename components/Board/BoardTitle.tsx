'use client';

import { FragmentType, useFragment } from '@/gql/__generated__';
import { BoardFragment } from '../Dashboard/Board';

type BoardProps = {
  query: FragmentType<typeof BoardFragment>;
};

function BoardTitle({ query }: BoardProps) {
  const board = useFragment(BoardFragment, query).node;

  return (
    <>
      {/* BOARD TITLE */}
      <h1 className='my-3 pb-3 border-b border-border text-2xl font-bold text-foreground'>
        {board.title}
      </h1>
    </>
  );
}
export default BoardTitle;
