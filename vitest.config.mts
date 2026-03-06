/// <reference types="vitest/browser" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { playwright } from '@vitest/browser-playwright';
import path from 'path';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    reporters: ['junit', 'default'],
    outputFile: {
      junit: './reports/junit-report.xml',
    },
    browser: {
      provider: playwright(),
      enabled: true,
      instances: [{ browser: 'chromium' }],
    },
    clearMocks: true,
  },
  resolve: {
    alias: {
      // Replace Next.js modules with lightweight browser-safe stubs.
      // Add more entries here if you import other next/* modules in tested components.
      'next/link': path.resolve(__dirname, 'mocks/next-link.tsx'),
    },
  },
});
