export const renderError = (
  error: unknown,
  message: string | undefined = 'An error occurred',
) => {
  return { error: error instanceof Error ? error.message : message };
};
