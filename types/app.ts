import { List_Fields } from '@/gql/__generated__/graphql';
import { ListField } from './jsonbSchema';

export type Theme = 'light' | 'dark';

export type FormState<TData = undefined> = {
  data?: TData;
  error: string | null;
};

export type ActionFunction = (
  formState: FormState,
  formData: FormData,
) => Promise<FormState>;

/**** Mutation ****/

export type ListFieldForm = Record<string, ListFieldData>;
export type ListFieldData<TData = ListField> = Omit<TData, 'config'>;

export type QueryListField = Pick<
  List_Fields,
  'id' | 'type' | 'position' | 'config'
>;

/**** ****/
