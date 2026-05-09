export const renderError = (error: unknown) => {
  const errorMessage =
    error instanceof Error ? error.message : 'An error occurred';
  return { data: null, error: errorMessage };
};
