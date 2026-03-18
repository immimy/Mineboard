import { page, userEvent } from 'vitest/browser';
import UserButton from '../UserButton';
import { renderAsync } from '@/mocks/browser/helper/helpers';
import { mockGetUser, mockUser } from '@/mocks/browser/supabase/serverClient';

const getAllElements = () => {
  return {
    userButton: page.getByRole('button', { name: 'user icon' }),
    userAvatar: page.getByRole('img', { name: mockUser.email }),
    signInButton: page.getByRole('button', { name: /sign in/i }),
    signOutButton: page.getByRole('button', { name: /sign out/i }),
  };
};

// ---------------------------------------------------------------------------
// UI when user is NOT authenticated
// ---------------------------------------------------------------------------

describe('UserButton — UI when user is NOT authenticated', () => {
  beforeEach(() => {
    vi.mocked(mockGetUser).mockReturnValue({
      data: { user: null },
    });
  });

  it('renders the user icon button', async () => {
    await renderAsync(UserButton());
    const { userButton } = getAllElements();
    await expect.element(userButton).toBeInTheDocument();
  });

  it('does not render user avatar image', async () => {
    await renderAsync(UserButton());
    await expect
      .element(page.getByRole('img', { name: mockUser.email }).query())
      .not.toBeInTheDocument();
  });

  it('shows SignInButton inside popover panel', async () => {
    await renderAsync(UserButton());
    const { userButton, signInButton } = getAllElements();
    await userEvent.click(userButton);
    await expect.element(signInButton).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// UI when user IS authenticated
// ---------------------------------------------------------------------------

describe('UserButton — UI when user IS authenticated', () => {
  beforeEach(() => {
    vi.mocked(mockGetUser).mockReturnValue({
      data: { user: mockUser },
      error: null,
    });
  });

  it('renders the user avatar image', async () => {
    await renderAsync(UserButton());
    const { userAvatar } = getAllElements();
    await expect
      .element(userAvatar)
      .toHaveAttribute('src', mockUser.user_metadata.avatar_url);
  });

  it('does not render user icon', async () => {
    await renderAsync(UserButton());
    await expect
      .element(page.getByRole('button', { name: 'user icon' }).query())
      .not.toBeInTheDocument();
  });

  it('shows SignOutButton inside popover panel', async () => {
    await renderAsync(UserButton());
    const { userAvatar, signOutButton } = getAllElements();
    await userEvent.click(userAvatar);
    await expect.element(signOutButton).toBeInTheDocument();
  });
});
