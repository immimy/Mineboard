export const mockGetClaims = vi.fn();

export const createServerClient = vi.fn().mockReturnValue({
  auth: {
    getClaims: mockGetClaims,
  },
});
