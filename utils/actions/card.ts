'use server';

import { authenticateUser } from './auth';
import { createClient } from '../database/serverClient';
import { renderError } from './helper';
import {
  validateWithZodSchema,
  createCardSchema,
} from '../validation/validator';
import { CachedCardQuery, customQuery } from './graphql';

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
