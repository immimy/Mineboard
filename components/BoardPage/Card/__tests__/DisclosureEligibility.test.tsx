import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { DisclosureHarness } from './testUtils';

it('shows all content in one column or when the card has no overflow', async () => {
  // Case I: Display as single column
  await render(<DisclosureHarness singleColumn />);

  // Supplies overflow as true
  await page.getByRole('button', { name: 'Report overflow' }).click();

  const cardWrapper = page.getByTestId('card').element().parentElement!;

  // Asserts that there is no disclosure behavior
  await expect
    .element(page.getByRole('button', { name: 'Expand Tasks' }))
    .not.toBeInTheDocument();
  expect(cardWrapper).not.toHaveClass(
    'h-(--card-min-height)',
    'overflow-hidden',
  );

  // Supplies to display as multiple columns
  await page.getByRole('button', { name: 'Toggle columns' }).click();

  // Asserts that there is disclosure behavior
  await expect
    .element(page.getByRole('button', { name: 'Expand Tasks' }))
    .toBeVisible();
  expect(cardWrapper).toHaveClass('h-(--card-min-height)', 'overflow-hidden');

  // Case II: Display as multiple columns with no overflow
  await page.getByRole('button', { name: 'Report no overflow' }).click();

  // Asserts that there is no disclosure behavior
  await expect
    .element(page.getByRole('button', { name: 'Expand Tasks' }))
    .not.toBeInTheDocument();
  expect(cardWrapper).not.toHaveClass(
    'h-(--card-min-height)',
    'overflow-hidden',
  );
});
