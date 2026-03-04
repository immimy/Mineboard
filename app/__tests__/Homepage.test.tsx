import Homepage from '../page';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';

describe('Homepage Rendering', () => {
  beforeEach(() => {
    render(<Homepage />);
  });

  it('should render Mineboard heading', async () => {
    await expect
      .element(page.getByText(/mineboard demo web/i))
      .toBeInTheDocument();
  });

  it('should render paragraph', async () => {
    await expect
      .element(
        page.getByText(/A customizable board tailored to your preferences./i),
      )
      .toBeInTheDocument();
  });
});
