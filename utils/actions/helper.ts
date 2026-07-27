export const renderError = (error: unknown, defaultMessage?: string) => {
  const errorMessage =
    error instanceof Error
      ? error.message
      : defaultMessage || 'An error occurred';
  return { data: null, error: errorMessage };
};
