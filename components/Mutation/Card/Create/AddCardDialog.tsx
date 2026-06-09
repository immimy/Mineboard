'use client';

import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { useApolloClient } from '@apollo/client/react';
import { useBoardContext } from '@/components/Board/BoardContext';
import { createCard } from '@/utils/actions/card';
import TextInput from '@/components/Mutation/Card/CardInputs/TextInput';
import ColorInput from '@/components/Mutation/Card/CardInputs/ColorInput';
import FormContainer from '@/components/global/FormContainer';
import { ActionFunction } from '@/types/app';
import SubmitButton from '@/components/global/SubmitButton';
import { useFragment as readFragment } from '@/gql/__generated__';
import { CreatedCardFragmentDoc } from '@/gql/__generated__/graphql';

function AddCardDialog() {
  const client = useApolloClient();

  // Board context
  const { boardId, isAddCardOpen, closeAddCard } = useBoardContext();

  // Create card form action
  const handleSave: ActionFunction = async (_, formData) => {
    // Set board id to form data
    formData.set('boardId', boardId);

    // Server: Create card
    const { data, error } = await createCard(formData);
    if (error || !data) return { error };

    // Apollo cache update
    const cardEdge = data.cardsCollection?.edges[0].node;
    const card = readFragment(CreatedCardFragmentDoc, cardEdge);

    // 1. Write fragment
    const cardRef = client.cache.writeFragment({
      fragmentName: 'CreatedCard',
      fragment: CreatedCardFragmentDoc,
      data: card,
    });

    // 2. Cache modify
    client.cache.modify({
      id: 'ROOT_QUERY',
      fields: {
        cardsCollection(
          existingConnection = { __typename: 'cardsConnection', edges: [] },
        ) {
          const nextEdge = {
            __typename: 'cardsEdge',
            node: cardRef,
          };
          return {
            ...existingConnection,
            edges: [...existingConnection.edges, nextEdge],
          };
        },
      },
    });

    closeAddCard();

    return { error: null };
  };

  return (
    <Dialog open={isAddCardOpen} onClose={closeAddCard}>
      <div className='fixed inset-0 w-screen bg-neutral-foreground/10 p-4 overflow-auto'>
        <DialogPanel className='mx-auto mt-10 w-full max-w-lg rounded bg-background text-foreground p-4 md:p-8'>
          {/* HEADER */}
          <DialogTitle className='text-lg font-semibold capitalize text-accent text-shadow-2xs'>
            Create card
          </DialogTitle>
          <Description className='text-sm text-muted-foreground text-shadow-2xs'>
            Add a new card to this board.
          </Description>
          {/* ADD CARD FORM */}
          <FormContainer
            id='add_card'
            className='mt-4 grid gap-3'
            action={handleSave}
          >
            <TextInput
              id='title'
              label='title'
              placeholder='e.g. Personal goals'
              required
            />
            <ColorInput label='color' name='color' />
            {/* BUTTONS */}
            <div className='mt-4 flex justify-end gap-2'>
              <Button
                type='button'
                className='rounded border border-border px-3 py-1 hover:bg-destructive/50 hover:cursor-pointer hover:text-shadow-2xs font-semibold'
                onClick={closeAddCard}
              >
                Cancel
              </Button>
              <SubmitButton className='rounded border border-border px-3 py-1 hover:bg-successful/50 hover:cursor-pointer hover:text-shadow-2xs max-w-fit'>
                Save
              </SubmitButton>
            </div>
          </FormContainer>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
export default AddCardDialog;
