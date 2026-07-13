'use server';

import {
  createBoardSchema,
  createListFieldsSchema,
  updateListFieldsSchema,
  updateBoardTitleSchema,
  validateWithZodSchema,
} from '../validation/validator';
import { authenticateUser } from './auth';
import {
  BoardListFieldsQuery,
  CachedBoardListsQuery,
  CachedBoardQuery,
  CachedListFieldsQuery,
  customMutation,
  customQuery,
  UpdateBoardTitleMutation,
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

export const updateBoardTitle = async (formData: FormData) => {
  try {
    const supabase = await createClient();

    // Authenticated user only
    await authenticateUser(supabase);

    // Input validation
    const result = validateWithZodSchema(
      updateBoardTitleSchema,
      Object.fromEntries(formData),
    );

    // Update board
    const data = await customMutation({
      mutation: UpdateBoardTitleMutation,
      variables: {
        boardId: result.boardId,
        title: result.title,
        updatedAt: new Date().toISOString(),
      },
    });
    const updatedBoard = data?.updateboardsCollection.records[0];
    if (!updatedBoard) throw new Error('Failed to update board title');

    return { data: updatedBoard, error: null };
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

export const updateListFields = async (
  boardId: string,
  fields: ListFieldDraft[],
) => {
  try {
    const supabase = await createClient();

    // Authenticated user only
    await authenticateUser(supabase);

    // Get current database fields to derive removals on the server boundary.
    const dbListFieldsDocument = await customQuery({
      query: BoardListFieldsQuery,
      variables: { boardId },
    });
    const dbListFields = dbListFieldsDocument?.list_fieldsCollection?.edges;
    if (!dbListFields) throw new Error('Failed to fetch list fields');

    const submittedDatabaseIds = new Set(
      fields.map((field) => field.id).filter((id) => !id.startsWith('client:')),
    );
    const deletedFieldIds = dbListFields
      .map(({ node }) => node.id)
      .filter((id) => !submittedDatabaseIds.has(id));

    // Input validation
    const result = validateWithZodSchema(updateListFieldsSchema, {
      boardId,
      fields,
      deletedFieldIds,
    });

    // Update list fields
    const { data: updatedBoardId, error } = await supabase.rpc(
      'update_list_fields',
      {
        p_board_id: result.boardId,
        p_fields: result.fields,
        p_delete_field_ids: result.deletedFieldIds,
      },
    );
    if (error) throw new Error(error.message);

    // Query latest board fields and lists for cache update.
    const [listFieldsDocument, boardListsDocument] = await Promise.all([
      customQuery({
        query: CachedListFieldsQuery,
        variables: { boardId: updatedBoardId },
      }),
      customQuery({
        query: CachedBoardListsQuery,
        variables: { boardId: updatedBoardId },
      }),
    ]);
    if (!listFieldsDocument?.list_fieldsCollection) {
      throw new Error('Failed to fetch list fields, please refresh');
    }
    if (!boardListsDocument?.cardsCollection) {
      throw new Error('Failed to fetch board lists, please refresh');
    }

    return {
      data: {
        listFields: listFieldsDocument,
        boardLists: boardListsDocument,
      },
      error: null,
    };
  } catch (error) {
    return renderError(error);
  }
};
