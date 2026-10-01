import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { DisclosureHarness } from './testUtils';

it('toggles disclosure of an overflowing card', async () => {
  await render(<DisclosureHarness />);

  // Supplies overflow as true
  await page.getByRole('button', { name: 'Report overflow' }).click();

  const content = page.getByTestId('card-content');
  const cardWrapper = page.getByTestId('card').element().parentElement!;
  const expand = page.getByRole('button', { name: 'Expand Tasks' });

  // Asserts that card is collapsed
  await expect.element(expand).toHaveAttribute('aria-expanded', 'false');
  expect(expand.element().getAttribute('aria-controls')).toBe(
    content.element().id,
  );
  expect(cardWrapper).toHaveClass('h-(--card-min-height)', 'overflow-hidden');

  // Click to simulate card expand
  await expand.click();

  const collapse = page.getByRole('button', { name: 'Collapse Tasks' });

  // Asserts that card is expanded
  await expect.element(collapse).toHaveAttribute('aria-expanded', 'true');
  expect(cardWrapper).not.toHaveClass(
    'h-(--card-min-height)',
    'overflow-hidden',
  );

  // Click to simulate card collapse
  await collapse.click();

  // Asserts that card is collapsed
  await expect.element(expand).toHaveAttribute('aria-expanded', 'false');
  expect(cardWrapper).toHaveClass('h-(--card-min-height)', 'overflow-hidden');
});
