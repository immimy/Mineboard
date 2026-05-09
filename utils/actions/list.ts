'use server';

import { ListFieldForm } from '@/types/app';
import { authenticateUser } from './auth';
import { createClient } from '../database/serverClient';
import {
  createListSchema,
  validateWithZodSchema,
} from '../validation/validator';
import { formatToRpcCreateListValues } from '../validation/helper';
import {
  BoardListFieldsDocumentQuery,
  customQuery,
  ListWithValuesDocumentQuery,
} from './graphql';
import { renderError } from './helper';

export const createList = async (
  boardId: string,
  cardId: string,
  forms: ListFieldForm,
) => {
  try {
    const supabase = await createClient();

    // Authenticated user only
    await authenticateUser(supabase);

    // Get list fields from the database
    const listFieldsQuery = await customQuery({
      query: BoardListFieldsDocumentQuery,
      variables: { boardId },
    });
    const dbListFields = listFieldsQuery?.list_fieldsCollection;
    if (!dbListFields) throw new Error('Empty list fields');

    // Customize raw data
    let rawData: any[] = [];
    for (const { node } of dbListFields.edges) {
      rawData = [
        ...rawData,
        {
          listFieldId: node.id, // ref
          fieldType: node.type, // ref
          input: forms[node.id], // actual data pushed to the db
        },
      ];
    }

    // Input validation
    const result = validateWithZodSchema(createListSchema, {
      cardId,
      fieldValues: rawData,
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
      query: ListWithValuesDocumentQuery,
      variables: { listId },
    });
    if (!ListWithValuesDocument?.listsCollection)
      throw new Error('Failed to fetch new list, please refresh');

    return { data: ListWithValuesDocument, error: null };
  } catch (error) {
    return renderError(error);
  }
};
