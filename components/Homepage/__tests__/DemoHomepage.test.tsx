import { page } from 'vitest/browser';
import { renderDemoHomepage } from './testUtils';

describe('Demo homepage', () => {
  it('renders the first demo board by default', async () => {
    await renderDemoHomepage();

    await expect
      .element(page.getByRole('heading', { name: 'Weekly Reset' }))
      .toBeVisible();
    await expect
      .element(page.getByRole('article').filter({ hasText: 'Sunday routine' }))
      .toBeVisible();
    await expect
      .element(page.getByText('Prepare the week calmly'))
      .toBeVisible();
  });

  it('switches the displayed board and closes the demo navigation', async () => {
    await renderDemoHomepage({ withSidebarTrigger: true });

    const sidebar = page.getByLabelText('Demo board navigation', {
      exact: true,
    });
    await expect.element(sidebar).not.toBeVisible();

    await page.getByRole('button', { name: 'Open demo sidebar' }).click();
    await expect.element(sidebar).toBeVisible();

    await page.getByRole('button', { name: 'Travel Wishlist' }).click();

    await expect
      .element(page.getByRole('heading', { name: 'Travel Wishlist' }))
      .toBeVisible();
    await expect.element(page.getByText('No list fields yet')).toBeVisible();
    await expect
      .element(page.getByRole('heading', { name: 'Weekly Reset' }))
      .not.toBeInTheDocument();
    await expect.element(sidebar).not.toBeVisible();
  });
});
