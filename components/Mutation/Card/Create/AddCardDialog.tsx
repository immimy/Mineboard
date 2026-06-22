'use client';

import {
  Button,
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { useApolloClient } from '@apollo/client/react';
import { useBoardContext } from '@/components/BoardPage/BoardContext';
import { createCard } from '@/utils/actions/card';
import { ColorInput, TextInput } from '@/components/form';
import FormContainer from '@/components/global/FormContainer';
import { ActionFunction } from '@/types/app';
import SubmitButton from '@/components/global/SubmitButton';
import { useFragment as readFragment } from '@/gql/__generated__';
import { ColorPalette } from '@/types/jsonbSchema';
import { useState } from 'react';
import {
  CardsCollectionFragmentDoc,
  SingleBoardDocument,
  SingleBoardQuery,
  SingleBoardQueryVariables,
} from '@/gql/__generated__/graphql';

type AddCardFormState = { title: string; color: ColorPalette };
const INITIAL_STATE: AddCardFormState = {
  title: '',
  color: ColorPalette.first,
};

function AddCardDialog() {
  const client = useApolloClient();

  // Board context
  const { boardId, isAddCardOpen, closeAddCard } = useBoardContext();

  // Form state
  const [form, setForm] = useState<AddCardFormState>({ ...INITIAL_STATE });

  // Close dialog & Reset form state
  const handleCloseDialog = () => {
    setForm({ ...INITIAL_STATE });
    closeAddCard();
  };

  // Create card form action
  const handleSave: ActionFunction = async (_, formData) => {
    // Set board id to form data
    formData.set('boardId', boardId);

    // Server: Create card
    const { data, error } = await createCard(formData);
    if (error || !data) return { error };

    const card = data.cardsCollection?.edges[0];
    if (!card) return { error: 'Created card was not returned' };

    // Update `SingleBoardQuery` by appending new card to the collection
    client.cache.updateQuery<SingleBoardQuery, SingleBoardQueryVariables>(
      {
        query: SingleBoardDocument,
        variables: { boardId },
      },
      (queryData) => {
        if (!queryData?.cardsCollection) return queryData;

        const existingEdges =
          readFragment(CardsCollectionFragmentDoc, queryData.cardsCollection)
            .edges ?? [];

        const cardExists = existingEdges.some(
          (edge) => edge.node.id === card.node.id,
        );
        if (cardExists) return queryData;

        return {
          ...queryData,
          cardsCollection: {
            ...queryData.cardsCollection,
            edges: [...existingEdges, card],
          },
        };
      },
    );

    handleCloseDialog();

    return { error: null };
  };

  return (
    <Dialog
      open={isAddCardOpen}
      onClose={handleCloseDialog}
      className='relative z-50'
    >
      <DialogBackdrop className='fixed inset-0 bg-neutral-foreground/30 dark:bg-neutral/30' />
      <div className='fixed inset-0 w-screen p-4 overflow-auto'>
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
              value={form.title}
              onChange={(value) =>
                setForm((state) => ({ ...state, title: value }))
              }
            />
            <ColorInput
              label='color'
              name='color'
              value={form.color}
              onChange={(value) =>
                setForm((state) => ({ ...state, color: value }))
              }
            />
            {/* BUTTONS */}
            <div className='mt-4 flex justify-end gap-2'>
              <Button
                type='button'
                className='rounded border border-border px-3 py-1 hover:bg-destructive/50 hover:cursor-pointer hover:text-shadow-2xs font-semibold'
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <SubmitButton
                text='Save'
                className='rounded border border-border px-3 py-1 hover:bg-successful/50 hover:cursor-pointer hover:text-shadow-2xs max-w-fit'
              />
            </div>
          </FormContainer>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
export default AddCardDialog;
