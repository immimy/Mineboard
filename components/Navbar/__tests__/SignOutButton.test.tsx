import { signOutWithGoogle } from '@/utils/database/auth';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import SignOutButton from '../SignOutButton';
import { mockReplace } from '@/mocks/browser/next/navigation';

/** Mock */
// Apollo
const mockClearStore = vi.fn();
vi.mock('@apollo/client/react', () => ({
  useApolloClient: () => ({ clearStore: mockClearStore }),
}));
// Signin action
vi.mock('@/utils/database/auth');
/** */

const getAllElements = () => {
  return {
    signOutButton: page.getByRole('button', { name: /sign out/i }),
  };
};

beforeEach(() => {
  vi.mocked(signOutWithGoogle).mockImplementation(async () => {
    return { error: null };
  });
});

// ---------------------------------------------------------------------------
// SignOutWithGoogle action is called when log out
// ---------------------------------------------------------------------------

it('SignOutWithGoogle action is called when log out', async () => {
  render(<SignOutButton />);
  await userEvent.click(getAllElements().signOutButton);
  await vi.waitFor(() => {
    // Function calls
    // 1. Signout server action
    expect(signOutWithGoogle).toHaveBeenCalledOnce();
    // 2. Clear Apollo cache on the client
    expect(mockClearStore).toHaveBeenCalledOnce();
    // 3. Redirect a user to the homepage
    expect(mockReplace).toHaveBeenCalledWith('/');
  });
});
