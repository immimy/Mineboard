import { cleanup } from 'vitest-browser-react';

// Clean up after each test.
afterEach(async () => {
  // Remove all components rendered with `render`
  await cleanup();
  // Prevent fake timers from leaking into the next browser test.
  vi.useRealTimers();
  // Clears all information about every call.
  // (This method does not reset implementations.)
  vi.clearAllMocks();
});
