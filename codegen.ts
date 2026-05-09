import { CodegenConfig } from '@graphql-codegen/cli';
import { addTypenameSelectionDocumentTransform } from '@graphql-codegen/client-preset';

const config: CodegenConfig = {
  overwrite: true,
  schema:
    process.env.VERCEL_ENV === 'production'
      ? `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL}/graphql/v1`
      : 'http://localhost:54321/graphql/v1',
  // Define the path that all graphql queries live
  documents: [
    '{app,components,gql,utils/actions}/**/*.{ts,tsx}',
    '!gql/__generated__/**',
  ],
  // Don't exit with non-zero status when there are no documents
  ignoreNoDocuments: true,
  generates: {
    'gql/__generated__/': {
      preset: 'client',
      documentTransforms: [addTypenameSelectionDocumentTransform],
      plugins: [],
      config: {
        scalars: {
          UUID: 'string',
          Date: 'string',
          Time: 'string',
          Datetime: 'string',
          JSON: 'string',
          BigInt: 'string',
          BigFloat: 'string',
          Opaque: 'any',
        },
      },
    },
  },
};

export default config;
