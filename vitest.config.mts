/// <reference types="vitest/browser" />
import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';

const mockBrowserPath = (...segments: string[]) =>
  fileURLToPath(
    new URL(['./mocks/browser', ...segments].join('/'), import.meta.url),
  );

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'browser',
    globals: true,
    browser: {
      provider: playwright(),
      enabled: true,
      instances: [{ browser: 'chromium' }],
    },
    reporters: ['junit', 'default'],
    outputFile: {
      junit: './reports/junit-report.xml',
    },
    clearMocks: true, // clears all history of every call
    setupFiles: ['vitest.setup.ts'],
    exclude: [
      ...configDefaults.exclude,
      '**/node_modules/**',
      '**/dist/**',
      './temp/**',
      '**/**.node.test.ts',
    ],
  },
  define: {
    // Polyfills process.env for browser bundle at build time
    'process.env': JSON.stringify({
      // explicitly list only the vars the component uses
      VERCEL_ENV: process.env.VERCEL_ENV,
    }),
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      'server-only': fileURLToPath(
        new URL('./mocks/server-only.ts', import.meta.url),
      ),
      // Replace modules with lightweight browser-safe stubs.
      /**
       * React-Toastify
       */
      'react-toastify': mockBrowserPath('react-toastify', 'toast.ts'),
      /**
       * Next.js
       */
      'next/link': mockBrowserPath('next', 'link.tsx'),
      'next/image': mockBrowserPath('next', 'image.tsx'),
      'next/headers': mockBrowserPath('next', 'headers.ts'),
      'next/navigation': mockBrowserPath('next', 'navigation.ts'),
      /**
       * Supabase
       */
      '@/utils/database/serverClient': mockBrowserPath(
        'supabase',
        'serverClient.ts',
      ),
      '@supabase/ssr': mockBrowserPath('supabase', 'ssr.ts'),
    },
  },
});
