export type Theme = 'light' | 'dark';

export type FormState<TData = undefined> = {
  data?: TData;
  error: string | null;
};
