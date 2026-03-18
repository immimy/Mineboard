import { signOutWithGoogle } from '@/utils/database/auth';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import SignOutButton from '../SignOutButton';

vi.mock('@/utils/database/auth');

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
  expect(signOutWithGoogle).toHaveBeenCalledOnce();
});
