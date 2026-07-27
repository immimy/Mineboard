import { configDefaults, defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const mockNodePath = (...segments: string[]) =>
  fileURLToPath(
    new URL(['./mocks/node', ...segments].join('/'), import.meta.url),
  );

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
      'server-only': fileURLToPath(
        new URL('./mocks/server-only.ts', import.meta.url),
      ),
      // Replace modules with stubs.
      /**
       * Next.js
       */
      'next/navigation': mockNodePath('next', 'navigation.ts'),
      'next/headers': mockNodePath('next', 'headers.ts'),
      /**
       * Supabase
       */
      '@/utils/database/serverClient': mockNodePath(
        'supabase',
        'serverClient.ts',
      ),
      '@supabase/ssr': mockNodePath('supabase', 'ssr.ts'),
    },
  },
});
