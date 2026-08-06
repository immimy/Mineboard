import 'server-only';

import { supabaseProjectUrl } from '@/utils/database/config';
import { getSupabaseSecretKey } from '@/utils/database/adminClient';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export function createAdminApolloClient() {
  const secretKey = getSupabaseSecretKey();

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: `${supabaseProjectUrl}/graphql/v1`,
      headers: {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
      },
      fetchOptions: { cache: 'no-store' },
    }),
  });
}
