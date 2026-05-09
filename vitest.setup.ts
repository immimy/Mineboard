import { cleanup } from 'vitest-browser-react';

// Cleaning after each tests
afterEach(() => {
  // Remove all components rendered with `render`
  cleanup();
  // Clears all information about every call.
  // (This method does not reset implementations.)
  vi.clearAllMocks();
});
