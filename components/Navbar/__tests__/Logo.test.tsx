import { page } from 'vitest/browser';
import Navbar from '../Navbar';
import { render } from 'vitest-browser-react';

// Stub out UserButton so Navbar tests don't depend on Supabase
vi.mock('@/components/Navbar/UserButton', () => ({
  default: () => <div data-testid='mock-user-button' />,
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
