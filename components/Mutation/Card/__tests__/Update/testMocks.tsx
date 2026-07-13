import { mockCardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import type { UpdateCardFormState } from '@/components/Mutation/Context/types';
import { ColorPalette } from '@/types/jsonbSchema';

export const initialUpdateCardForm = {
  cardId: mockCardId,
  title: 'Test Card',
  color: ColorPalette.first,
} satisfies UpdateCardFormState;

export const secondUpdateCardForm = {
  cardId: 'cardId2',
  title: 'Second Card',
  color: ColorPalette.second,
} satisfies UpdateCardFormState;

export const missingCardIdForm = {
  cardId: '',
  title: 'Missing Card',
  color: ColorPalette.first,
} satisfies UpdateCardFormState;

export const UPDATE_CARD_SUCCESS = {
  data: {
    __typename: 'cards' as const,
    id: mockCardId,
    title: 'Updated card',
    color: ColorPalette.third,
  },
  error: null,
};

export const UPDATE_CARD_FAIL = {
  data: null,
  error: 'Failed to update card',
};
