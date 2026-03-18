import { headers } from '@/mocks/node/next/headers';
import {
  mockSignInWithOAuth,
  mockSignOut,
} from '@/mocks/node/supabase/serverClient';
import { signInWithGoogle, signOutWithGoogle } from '@/utils/database/auth';

const mock = {
  origin: 'http://localhost:3000',
  googleOAuth: 'https://accounts.google.com/o/oauth2/auth?mock=true',
};

// ---------------------------------------------------------------------------
// SignInWithGoogle action
// ---------------------------------------------------------------------------

describe('SignInWithGoogle action', () => {
  beforeEach(() => {
    // Mock headers from 'next/headers'
    vi.mocked(headers).mockReturnValue({
      get: vi.fn((key: string) => {
        if (key === 'origin') return mock.origin;
        return null;
      }),
    });
  });

  it('redirects to Google OAuth URL on success', async () => {
    // Supabase mock on success
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: mock.googleOAuth },
      error: null,
    });

    // ✅ signInWithGoogle action throws NEXT_REDIRECT on success
    await expect(signInWithGoogle()).rejects.toThrow(
      `NEXT_REDIRECT: ${mock.googleOAuth}`,
    );
    // ✅ signInWithOAuth method have been called with correct values
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: `${mock.origin}/api/auth?next=/dashboard`,
      },
    });
  });

  it('redirects to the homepage with error when Supabase returns an error', async () => {
    // Supabase mock with error
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: null },
      error: { message: 'Sign in failed' },
    });

    // ✅ signInWithGoogle action return an error message
    await expect(signInWithGoogle()).resolves.toEqual({
      error: 'Sign in failed',
    });
  });
});

// ---------------------------------------------------------------------------
// SignOutWithGoogle action
// ---------------------------------------------------------------------------

describe('SignOutWithGoogle action', () => {
  it('redirects to the homepage on success', async () => {
    // Supabase mock on success
    mockSignOut.mockResolvedValue({
      error: null,
    });

    // ✅ signOutWithGoogle action throws NEXT_REDIRECT on success
    await expect(signOutWithGoogle()).rejects.toThrow('NEXT_REDIRECT: /');
    // ✅ signOut method have been called one time
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('renders error message when Supabase returns an error', async () => {
    // Supabase mock with error
    mockSignOut.mockResolvedValue({
      error: { message: 'Sign out failed' },
    });

    // ✅ signOutWithGoogle action return an error message
    await expect(signOutWithGoogle()).resolves.toEqual({
      error: 'Sign out failed',
    });
  });
});
