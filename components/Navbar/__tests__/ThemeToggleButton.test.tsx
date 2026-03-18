import { Locator, page, userEvent } from 'vitest/browser';
import ThemeToggleButton from '../ThemeToggleButton';
import { render } from 'vitest-browser-react';

const renderElement = async (input: Locator | HTMLElement | SVGElement) =>
  expect.element(input).toBeInTheDocument();

const getAllElements = () => {
  return {
    themeToggleButton: page.getByRole('button', { name: 'theme toggle' }),
  };
};

// Clearance
beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

// ---------------------------------------------------------------------------
// Theme toggle — localStorage takes priority over matchMedia
// ---------------------------------------------------------------------------

describe('Theme toggle — read localStorage on mount', () => {
  it('adds "dark" class to <html> when localStorage is "dark"', async () => {
    localStorage.setItem('prefers-scheme', 'dark');
    await render(<ThemeToggleButton />);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes "dark" class from <html> when localStorage is "light"', async () => {
    localStorage.setItem('prefers-scheme', 'light');
    document.documentElement.classList.add('dark'); // pre-set dark to confirm removal
    await render(<ThemeToggleButton />);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Theme toggle — icon rendered correctly
// ---------------------------------------------------------------------------

describe('Theme icon — icon rendered correctly', () => {
  it('renders MoonIcon when scheme is dark', async () => {
    localStorage.setItem('prefers-scheme', 'dark');
    render(<ThemeToggleButton />);
    const themeButton = getAllElements().themeToggleButton;
    await renderElement(themeButton);
    await expect
      .element(themeButton.element().querySelector('svg'))
      .toHaveClass('bi-moon-stars-fill');
  });

  it('renders SunIcon when scheme is light', async () => {
    localStorage.setItem('prefers-scheme', 'light');
    render(<ThemeToggleButton />);
    const themeButton = getAllElements().themeToggleButton;
    await renderElement(themeButton);
    await expect
      .element(themeButton.element().querySelector('svg'))
      .toHaveClass('bi-cloud-sun-fill');
  });
});

// ---------------------------------------------------------------------------
// Theme toggle interaction
// ---------------------------------------------------------------------------

describe('Theme toggle interaction', () => {
  it('toggles from light → dark', async () => {
    localStorage.setItem('prefers-scheme', 'light');
    render(<ThemeToggleButton />);
    const themeButton = getAllElements().themeToggleButton;
    await renderElement(themeButton);
    await userEvent.click(themeButton);
    // Add "dark" class to <html>
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    // Persist "dark" to localStorage
    expect(localStorage.getItem('prefers-scheme')).toBe('dark');
  });

  it('toggles from dark → light', async () => {
    localStorage.setItem('prefers-scheme', 'dark');
    render(<ThemeToggleButton />);
    const themeButton = getAllElements().themeToggleButton;
    await renderElement(themeButton);
    await userEvent.click(themeButton);
    // Remove "dark" class from <html>
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    // Persist "light" to localStorage
    expect(localStorage.getItem('prefers-scheme')).toBe('light');
  });

  it('toggles twice: returns to the original theme', async () => {
    localStorage.setItem('prefers-scheme', 'dark');
    render(<ThemeToggleButton />);
    const themeButton = getAllElements().themeToggleButton;
    await renderElement(themeButton);
    await userEvent.click(themeButton); // dark  → light
    await userEvent.click(themeButton); // light → dark
    // Assertions
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('prefers-scheme')).toBe('dark');
  });
});
