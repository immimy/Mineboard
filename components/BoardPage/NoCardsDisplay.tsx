'use client';

import { useAddCardDialogActions } from '@/components/Mutation/Context/AddCardDialogContext';
import { useListFieldDialogActions } from '@/components/Mutation/Context/ListFieldDialogContext';
import { FragmentType, useFragment as readFragment } from '@/gql/__generated__';
import {
  CardsCollectionFragmentDoc,
  ListFieldsCollectionFragmentDoc,
} from '@/gql/__generated__/graphql';
import { GearIcon, PlusIcon } from '@/icons/icons';
import { Button } from '@headlessui/react';
import type { ComponentType } from 'react';

type NoCardsDisplayProps = {
  cardsQuery?: FragmentType<typeof CardsCollectionFragmentDoc> | null;
  listFieldsQuery?: FragmentType<typeof ListFieldsCollectionFragmentDoc> | null;
};

function NoCardsDisplay({ cardsQuery, listFieldsQuery }: NoCardsDisplayProps) {
  const { openAddCard } = useAddCardDialogActions();
  const { openListFieldDialog } = useListFieldDialogActions();
  const cards = readFragment(CardsCollectionFragmentDoc, cardsQuery);
  const listFields = readFragment(
    ListFieldsCollectionFragmentDoc,
    listFieldsQuery,
  );

  if (!listFields?.edges.length) {
    return (
      <EmptyBoardState
        Icon={GearIcon}
        title='No list fields yet'
        description='Cards need at least one list field before they can be created.'
        actionLabel='Create one'
        onAction={openListFieldDialog}
      />
    );
  }

  if (!cards?.edges.length) {
    return (
      <EmptyBoardState
        Icon={PlusIcon}
        title='No cards yet'
        description='Add the first card and start filling in your board fields.'
        actionLabel='Create one'
        onAction={openAddCard}
      />
    );
  }

  return null;
}
export default NoCardsDisplay;

type EmptyBoardStateProps = {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

function EmptyBoardState({
  Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyBoardStateProps) {
  return (
    <section className='mt-6 grid min-h-72 place-items-center rounded-lg border border-dashed border-border bg-muted/30 px-4 py-10 text-center sm:px-6'>
      <div className='flex w-full max-w-md flex-col items-center'>
        <div className='grid size-12 place-items-center rounded-full border border-accent/40 bg-background text-accent shadow-sm shadow-border/70'>
          <Icon className='size-5' />
        </div>
        <h2 className='mt-4 text-xl font-semibold tracking-tight text-foreground'>
          {title}
        </h2>
        <p className='mt-2 text-sm leading-6 text-muted-foreground'>
          {description}
        </p>
        <Button
          type='button'
          onClick={onAction}
          className='mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-foreground shadow-sm shadow-border/70 transition hover:cursor-pointer hover:bg-accent/90 focus:outline-none data-focus:ring-2 data-focus:ring-accent/50 data-focus:ring-offset-2 data-focus:ring-offset-background'
        >
          {actionLabel}
        </Button>
      </div>
    </section>
  );
}
