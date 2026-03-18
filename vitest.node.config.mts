import { configDefaults, defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [tsconfigPaths()],
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
  },
  resolve: {
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
