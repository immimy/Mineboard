import { page } from 'vitest/browser';
import { renderBoard } from './DragDrop/testUtils';

it('keeps a collapsed card list and add-list control inert until expanded', async () => {
  await renderBoard();

  const grid = document.querySelector('section')!;
  // Browser tests do not load Tailwind CSS, so provide the measured grid layout.
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(2, minmax(350px, 1fr))';
  grid.style.width = '800px';
  await vi.waitFor(() => {
    expect(grid.className).toContain('[--card-min-height:350px]');
  });

  const card = page.getByRole('article').filter({ hasText: 'Card A' });
  const cardWrapper = card.element().parentElement!;
  const lists = card.element().querySelector('ul');
  const addListButton = Array.from(
    card.element().querySelectorAll('button'),
  ).find((button) => button.textContent?.trim().toLowerCase() === 'add list');

  expect(lists).not.toBeNull();
  expect(addListButton).toBeDefined();

  // Make this real card overflow its 350px grid height, then let ResizeObserver
  // report the new article height through the production measurement hook.
  lists!.style.minHeight = '500px';
  const expand = page.getByRole('button', { name: 'Expand Card A' });

  // Assertion:
  // - Card is collapsed.
  // - List container and add list button are inert.
  await expect.element(expand).toBeVisible();
  expect(cardWrapper).toHaveClass('h-(--card-min-height)', 'overflow-hidden');
  expect(lists).toHaveAttribute('inert');
  expect(lists).toHaveAttribute('aria-hidden', 'true');
  expect(addListButton?.parentElement).toHaveAttribute('inert');

  await expand.click();

  // Assertion:
  // - Displays collapse button
  // - Card is expanded.
  // - List container and add list button are not inert.
  await expect
    .element(page.getByRole('button', { name: 'Collapse Card A' }))
    .toBeVisible();
  expect(cardWrapper).not.toHaveClass(
    'h-(--card-min-height)',
    'overflow-hidden',
  );
  expect(lists).not.toHaveAttribute('inert');
  expect(lists).not.toHaveAttribute('aria-hidden');
  expect(addListButton?.parentElement).not.toHaveAttribute('inert');
});
