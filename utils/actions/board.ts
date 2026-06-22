'use server';

import {
  createBoardSchema,
  createListFieldsSchema,
  validateWithZodSchema,
} from '../validation/validator';
import { authenticateUser } from './auth';
import {
  CachedBoardQuery,
  customQuery,
  CachedListFieldsQuery,
} from './graphql';
import { renderError } from './helper';
import { createClient } from '../database/serverClient';
import { ListFieldDraft } from '@/types/jsonbSchema';

export const createBoard = async (formData: FormData) => {
  try {
    const supabase = await createClient();

    // Authenticated user only
    await authenticateUser(supabase);

    // Input validation
    const result = validateWithZodSchema(
      createBoardSchema,
      Object.fromEntries(formData),
    );

    // Create board
    const { data: boardId, error } = await supabase.rpc('create_board', {
      p_title: result.title,
    });
    if (error) throw new Error(error.message);

    // Query new created board for cache update
    const boardDocument = await customQuery({
      query: CachedBoardQuery,
      variables: { boardId },
    });
    if (!boardDocument?.boardsCollection?.edges.length) {
      throw new Error('Failed to fetch new board, please refresh');
    }

    return { data: boardDocument, error: null };
  } catch (error) {
    return renderError(error);
  }
};

export const createListFields = async (
  boardId: string,
  fields: ListFieldDraft[],
) => {
  try {
    const supabase = await createClient();

    // Authenticated user only
    await authenticateUser(supabase);

    // Input validation
    const result = validateWithZodSchema(createListFieldsSchema, {
      boardId,
      fields,
    });

    // Create list fields
    const { data: createdBoardId, error } = await supabase.rpc(
      'create_list_fields',
      {
        p_board_id: result.boardId,
        p_fields: result.fields,
      },
    );
    if (error) throw new Error(error.message);

    // Query list fields for cache update
    const listFieldsDocument = await customQuery({
      query: CachedListFieldsQuery,
      variables: { boardId: createdBoardId },
    });
    if (!listFieldsDocument?.list_fieldsCollection) {
      throw new Error('Failed to fetch list fields, please refresh');
    }

    return { data: listFieldsDocument, error: null };
  } catch (error) {
    return renderError(error);
  }
};
