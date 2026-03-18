import { cleanup } from 'vitest-browser-react';

// Cleaning the DOM after each tests
afterEach(() => {
  cleanup();
});
