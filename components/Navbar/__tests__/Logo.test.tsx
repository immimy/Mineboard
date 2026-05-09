import { page } from 'vitest/browser';
import Navbar from '../Navbar';
import { render } from 'vitest-browser-react';

// Stub out UserButton so Navbar tests don't depend on Supabase
vi.mock('@/components/Navbar/UserButton', () => ({
  default: () => <div data-testid='mock-user-button' />,
}));
// Stub out DevUserButton so Navbar tests don't depend on async server component
vi.mock('@/components/Navbar/Mocks/DevUserButton', () => ({
  default: () => <div data-testid='mock-dev-user-button' />,
}));

// ---------------------------------------------------------------------------
// Rendering homepage link
// ---------------------------------------------------------------------------

describe('"Mineboard" logo', () => {
  it('renders "Minebord" as a link', async () => {
    render(<Navbar />);
    await expect
      .element(page.getByRole('link', { name: /mineboard/i }))
      .toBeInTheDocument();
  });
});
