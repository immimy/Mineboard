'use server';

import { authenticateUser } from './auth';
import { createClient } from '../database/serverClient';
import { renderError } from './helper';
import {
  validateWithZodSchema,
  createCardSchema,
  deleteCardsSchema,
  updateCardSchema,
} from '../validation/validator';
import {
  CachedCardQuery,
  customMutation,
  customQuery,
  DeleteCardsMutation,
  UpdateCardMutation,
} from './graphql';
import { revalidateDemoHomepage } from './helper';

export const createCard = async (formData: FormData) => {
  const supabase = await createClient();
  // Authenticated user only
  const user = await authenticateUser(supabase);

  try {
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

    revalidateDemoHomepage(user);
    return { data: cardDocument, error: null };
  } catch (error) {
    return renderError(error);
  }
};

export const updateCard = async (formData: FormData) => {
  const supabase = await createClient();
  // Authenticated user only
  const user = await authenticateUser(supabase);

  try {
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

    revalidateDemoHomepage(user);
    return { data: updatedCard, error: null };
  } catch (error) {
    return renderError(error);
  }
};

export const deleteCards = async (boardId: string, cardIds: string[]) => {
  const supabase = await createClient();
  const user = await authenticateUser(supabase);

  try {
    const result = validateWithZodSchema(deleteCardsSchema, {
      boardId,
      cardIds,
    });
    const data = await customMutation({
      mutation: DeleteCardsMutation,
      variables: {
        boardId: result.boardId,
        cardIds: result.cardIds,
        expectedCount: result.cardIds.length,
      },
    });

    if (
      data?.deleteFromcardsCollection.affectedCount !== result.cardIds.length
    ) {
      throw new Error('Failed to delete selected cards');
    }

    revalidateDemoHomepage(user);
    return { error: null };
  } catch (error) {
    return renderError(error);
  }
};
