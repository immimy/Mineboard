import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { DisclosureHarness } from './testUtils';

it('opens a hovered card for an incoming list and keeps it open afterward', async () => {
  await render(<DisclosureHarness />);

  // Supplies overflow as true
  await page.getByRole('button', { name: 'Report overflow' }).click();

  const cardWrapper = page.getByTestId('card').element().parentElement!;

  // Assert that card is collapsed
  expect(cardWrapper).toHaveClass('h-(--card-min-height)', 'overflow-hidden');

  // Supplies list hover over as true
  await page.getByRole('button', { name: 'Toggle list hover' }).click();

  // Assert that card is expanded after be hovered by list
  const collapse = page.getByRole('button', { name: 'Collapse Tasks' });
  await expect.element(collapse).toHaveAttribute('aria-expanded', 'true');

  // Supplies list hover over as false
  await page.getByRole('button', { name: 'Toggle list hover' }).click();

  // Assert that card is still expanded after a list leaves
  await expect.element(collapse).toHaveAttribute('aria-expanded', 'true');
  expect(cardWrapper).not.toHaveClass(
    'h-(--card-min-height)',
    'overflow-hidden',
  );
});
