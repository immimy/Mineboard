import type { CardFormState } from '@/components/Mutation/Card/CardDialog';
import { ColorPalette, ListFieldValue } from '@/types/jsonbSchema';

export const INITIAL_CARD_FORM: CardFormState = {
  title: '',
  color: ColorPalette.first,
};

export const INITIAL_UPDATE_CARD_FORM: UpdateCardFormState = {
  cardId: '',
  ...INITIAL_CARD_FORM,
};

export type UpdateCardFormState = {
  cardId: string;
} & CardFormState;

export type UpdateListInput = {
  cardId: string;
  listId: string;
  listValues: {
    listFieldId: string;
    value: ListFieldValue;
  }[];
};
