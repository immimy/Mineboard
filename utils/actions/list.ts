'use server';

import { ListForm } from '@/types/app';
import { authenticateUser } from './auth';
import { createClient } from '../database/serverClient';
import {
  createListSchema,
  updateListSchema,
  validateWithZodSchema,
} from '../validation/validator';
import {
  formatListValues,
  formatToRpcCreateListValues,
  isEmptyFieldValue,
} from '../validation/helper';
import {
  BoardListFieldsQuery,
  CachedListQuery,
  customQuery,
  ListValuesQuery,
} from './graphql';
import { renderError } from './helper';
import { ListValueInput } from '../validation/validator';

export const createList = async (
  boardId: string,
  cardId: string,
  forms: ListForm,
) => {
  const supabase = await createClient();
  // Authenticated user only
  await authenticateUser(supabase);

  try {
    // Get list fields from the database
    const listFieldsQuery = await customQuery({
      query: BoardListFieldsQuery,
      variables: { boardId },
    });
    const dbListFields = listFieldsQuery?.list_fieldsCollection;
    if (!dbListFields) throw new Error('Empty list fields');

    // Input validation
    const result = validateWithZodSchema(createListSchema, {
      cardId,
      fieldValues: formatListValues(dbListFields, forms),
    });

    // Create list with values
    const { data: listId, error } = await supabase.rpc(
      'create_list_with_values',
      {
        p_card_id: result.cardId,
        p_field_values: formatToRpcCreateListValues(result.fieldValues),
      },
    );
    if (error) throw new Error(error.message);

    // Query new created list with values for cache update
    const ListWithValuesDocument = await customQuery({
      query: CachedListQuery,
      variables: { listId },
    });
    if (!ListWithValuesDocument?.listsCollection)
      throw new Error('Failed to fetch new list, please refresh');

    return { data: ListWithValuesDocument, error: null };
  } catch (error) {
    return renderError(error);
  }
};

export const updateList = async (
  boardId: string,
  listId: string,
  forms: ListForm,
) => {
  const supabase = await createClient();
  // Authenticated user only
  await authenticateUser(supabase);

  try {
    // Get list fields from the database
    const listFieldsQuery = await customQuery({
      query: BoardListFieldsQuery,
      variables: { boardId },
    });
    const dbListFields = listFieldsQuery?.list_fieldsCollection;
    if (!dbListFields) throw new Error('Empty list fields');

    // Input validation
    const result = validateWithZodSchema(updateListSchema, {
      listId,
      fieldValues: formatListValues(dbListFields, forms),
    });

    const listValuesQuery = await customQuery({
      query: ListValuesQuery,
      variables: { listId: result.listId },
    });
    const existingValues = new Map(
      listValuesQuery?.list_valuesCollection?.edges.map(({ node }) => [
        node.list_field_id,
        node,
      ]),
    );

    // Split submitted list values into update, insert, and delete batches.
    const updateValues: {
      list_value_id: string;
      value: ListValueInput['input']['value'];
    }[] = [];
    const insertValues: {
      list_field_id: string;
      value: ListValueInput['input']['value'];
    }[] = [];
    const deleteValues: string[] = [];

    result.fieldValues.forEach((fieldValue) => {
      const existing = existingValues.get(fieldValue.listFieldId);

      // Filled list value
      if (!isEmptyFieldValue(fieldValue)) {
        // Update the existing one
        if (existing) {
          return updateValues.push({
            list_value_id: existing.id,
            value: fieldValue.input.value,
          });
        }

        // Insert a new value to the list
        return insertValues.push({
          list_field_id: fieldValue.listFieldId,
          value: fieldValue.input.value,
        });
      }

      // Empty list value
      // Delete the list value
      if (existing) return deleteValues.push(existing.id);
    });

    // Update list
    const { data: updatedListId, error } = await supabase.rpc('update_list', {
      p_list_id: result.listId,
      p_update_values: updateValues,
      p_insert_values: insertValues,
      p_delete_values: deleteValues,
    });
    if (error) throw new Error(error.message);

    // Query updated list with values for cache update
    const ListWithValuesDocument = await customQuery({
      query: CachedListQuery,
      variables: { listId: updatedListId ?? result.listId },
    });
    if (!ListWithValuesDocument?.listsCollection)
      throw new Error('Failed to fetch updated list, please refresh');

    return { data: ListWithValuesDocument, error: null };
  } catch (error) {
    return renderError(error);
  }
};
