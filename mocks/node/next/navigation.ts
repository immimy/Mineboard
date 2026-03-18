export const redirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT: ${url}`);
});
