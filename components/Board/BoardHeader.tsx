'use client';

import { FragmentType, useFragment } from '@/gql/__generated__';
import { BoardFragment } from '../Dashboard/Board';
import AddCardOpenButton from '../Mutation/Card/Create/AddCardOpenButton';

type BoardProps = {
  query: FragmentType<typeof BoardFragment>;
};

function BoardHeader({ query }: BoardProps) {
  const board = useFragment(BoardFragment, query).node;

  return (
    <div className='py-1.5 border-b border-border flex justify-between items-center sticky top-11 lg:top-12 bg-background -mx-1.5'>
      {/* BOARD TITLE */}
      <h1 className='text-2xl font-bold text-foreground'>{board.title}</h1>
      {/* ADD CARD BUTTON */}
      <AddCardOpenButton />
    </div>
  );
}
export default BoardHeader;
