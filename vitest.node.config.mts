import { configDefaults, defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  plugins: [],
  test: {
    name: 'node',
    globals: true,
    environment: 'node',
    reporters: ['junit', 'default'],
    outputFile: {
      junit: './reports/junit-node-report.xml',
    },
    clearMocks: true, // clears all history of every call
    include: ['**/**.node.test.ts'],
    exclude: [
      ...configDefaults.exclude,
      '**/node_modules/**',
      '**/dist/**',
      './temp/**',
    ],
    setupFiles: ['vitest.node.setup.ts'],
    env: {
      VERCEL_ENV: process.env.VERCEL_ENV,
      NEXT_PUBLIC_SUPABASE_PROJECT_URL:
        process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    },
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      // Replace modules with stubs.
      /**
       * Next.js
       */
      'next/navigation': path.resolve(
        __dirname,
        'mocks/node/next/navigation.ts',
      ),
      'next/headers': path.resolve(__dirname, 'mocks/node/next/headers.ts'),
      /**
       * Supabase
       */
      '@/utils/database/serverClient': path.resolve(
        __dirname,
        'mocks/node/supabase/serverClient.ts',
      ),
      '@supabase/ssr': path.resolve(__dirname, 'mocks/node/supabase/ssr.ts'),
    },
  },
});
