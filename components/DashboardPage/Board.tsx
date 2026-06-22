'use client';

import Link from 'next/link';
import { FragmentType, graphql, useFragment } from '@/gql/__generated__';
import { Button } from '@headlessui/react';

export const BoardFragment = graphql(/* GraphQL */ `
  fragment Board on boardsEdge {
    node {
      id
      title
    }
  }
`);

type BoardProps = {
  query: FragmentType<typeof BoardFragment>;
};

function Board({ query }: BoardProps) {
  const board = useFragment(BoardFragment, query).node;

  return (
    <li key={board.id} className='text-foreground'>
      <Link href={`/dashboard/${board.id}`}>
        <Button
          type='button'
          className='w-full bg-neutral text-foreground text-md font-medium tracking-wider rounded ring-2 ring-border drop-shadow hover:scale-101 hover:ring-accent'
        >
          {board.title}
        </Button>
      </Link>
    </li>
  );
}
export default Board;
