'use server';

import { authenticateUser } from './auth';
import { createClient } from '../database/serverClient';
import { renderError } from './helper';
import {
  validateWithZodSchema,
  createCardSchema,
  updateCardSchema,
} from '../validation/validator';
import {
  CachedCardQuery,
  customMutation,
  customQuery,
  UpdateCardMutation,
} from './graphql';

export const createCard = async (formData: FormData) => {
  try {
    const supabase = await createClient();

    // Authenticated user only
    await authenticateUser(supabase);

    // Input validation
    const result = validateWithZodSchema(
      createCardSchema,
      Object.fromEntries(formData),
    );

    // Create card
    const { data: cardId, error } = await supabase.rpc('create_card', {
      p_board_id: result.boardId,
      p_title: result.title,
      p_color: result.color,
    });
    if (error) throw new Error(error.message);

    // Query new created card for cache update
    const cardDocument = await customQuery({
      query: CachedCardQuery,
      variables: { cardId },
    });

    return { data: cardDocument, error: null };
  } catch (error) {
    return renderError(error);
  }
};

export const updateCard = async (formData: FormData) => {
  try {
    const supabase = await createClient();

    // Authenticated user only
    await authenticateUser(supabase);

    // Input validation
    const result = validateWithZodSchema(
      updateCardSchema,
      Object.fromEntries(formData),
    );

    // Update card
    const data = await customMutation({
      mutation: UpdateCardMutation,
      variables: {
        cardId: result.cardId,
        title: result.title,
        color: result.color,
        updatedAt: new Date().toISOString(),
      },
    });
    const updatedCard = data?.updatecardsCollection.records[0];
    if (!updatedCard) throw new Error('Failed to update card');

    return { data: updatedCard, error: null };
  } catch (error) {
    return renderError(error);
  }
};
