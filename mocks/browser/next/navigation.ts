export const redirect = vi.fn();

export const useSearchParams = vi.fn(() => {
  return {
    get: vi.fn(),
  };
});
