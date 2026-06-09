import { ListFieldInput } from './jsonbSchema';

export type Theme = 'light' | 'dark';

export type FormState<TData = undefined> = {
  data?: TData;
  error: string | null;
};

export type ActionFunction = (
  formState: FormState,
  formData: FormData,
) => Promise<FormState>;

export type ListForm = Record<string, ListFieldInput>;
