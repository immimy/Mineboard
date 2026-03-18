import { signInWithGoogle } from '@/utils/database/auth';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import SignInButton from '../SingInButton';

vi.mock('@/utils/database/auth');

const getAllElements = () => {
  return {
    signInButton: page.getByRole('button', { name: /sign in/i }),
  };
};

beforeEach(() => {
  vi.mocked(signInWithGoogle).mockImplementation(async () => {
    return { error: null };
  });
});

// ---------------------------------------------------------------------------
// SignInWithGoogle action is called when log in
// ---------------------------------------------------------------------------

it('SignInWithGoogle action is called when log in', async () => {
  render(<SignInButton />);
  await userEvent.click(getAllElements().signInButton);
  expect(signInWithGoogle).toHaveBeenCalledOnce();
});
