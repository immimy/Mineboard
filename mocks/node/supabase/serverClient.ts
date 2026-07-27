export const mockSignInWithOAuth = vi.fn();
export const mockSignOut = vi.fn();
export const mockExchangeCodeForSession = vi.fn();
export const mockGetClaims = vi.fn();
export const mockGetUser = vi.fn();
export const mockRpc = vi.fn();

export const createClient = vi.fn(() => {
  return {
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
      signOut: mockSignOut,
      exchangeCodeForSession: mockExchangeCodeForSession,
      getClaims: mockGetClaims,
      getUser: mockGetUser,
    },
    rpc: mockRpc,
  };
});
