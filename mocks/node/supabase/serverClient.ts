export const mockSignInWithOAuth = vi.fn();
export const mockSignOut = vi.fn();
export const mockExchangeCodeForSession = vi.fn();

export const createClient = vi.fn(() => {
  return {
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
      signOut: mockSignOut,
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
  };
});
