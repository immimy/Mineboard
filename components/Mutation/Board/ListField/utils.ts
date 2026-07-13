import { ListFieldsCollectionFragment } from '@/gql/__generated__/graphql';
import { createFieldDraft } from '../Fields/utils';
import { ListFieldForm } from '@/types/app';

export function initFormState(
  dbListFields?: ListFieldsCollectionFragment['edges'],
): ListFieldForm[] {
  if (!dbListFields || !dbListFields.length) return [];
  return dbListFields.map(({ node: { id, type, config, position } }) =>
    createFieldDraft({ id, type, config, position }),
  );
}
