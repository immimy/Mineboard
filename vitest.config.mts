/// <reference types="vitest/browser" />
import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { playwright } from '@vitest/browser-playwright';
import path from 'path';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
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
    setupFiles: './vitest.setup.ts',
    exclude: [
      ...configDefaults.exclude,
      '**/node_modules/**',
      '**/dist/**',
      './temp/**',
      '**/**.node.test.ts',
    ],
  },
  resolve: {
    alias: {
      // Replace modules with lightweight browser-safe stubs.
      /**
       * React-Toastify
       */
      'react-toastify': path.resolve(
        __dirname,
        'mocks/browser/react-toastify/toast.ts',
      ),
      /**
       * Next.js
       */
      'next/link': path.resolve(__dirname, 'mocks/browser/next/link.tsx'),
      'next/image': path.resolve(__dirname, 'mocks/browser/next/image.tsx'),
      'next/headers': path.resolve(__dirname, 'mocks/browser/next/headers.ts'),
      'next/navigation': path.resolve(
        __dirname,
        'mocks/browser/next/navigation.ts',
      ),
      /**
       * Supabase
       */
      '@/utils/database/serverClient': path.resolve(
        __dirname,
        'mocks/browser/supabase/serverClient.ts',
      ),
      '@supabase/ssr': path.resolve(__dirname, 'mocks/browser/supabase/ssr.ts'),
    },
  },
});
