import { createClient } from '@/utils/database/serverClient';
import { HttpLink } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';
import { supabaseProjectUrl } from '@/utils/database/config';

const cache = new InMemoryCache();

const httpLink = new HttpLink({
  uri: `${supabaseProjectUrl}/graphql/v1`,
  fetchOptions: { cache: 'no-store' },
});

const authLink = new SetContextLink(async (prevContext) => {
  const supabase = await createClient();
  const token = (await supabase.auth.getSession()).data.session?.access_token;
  return {
    headers: {
      ...prevContext.headers,
      Authorization: token ? `Bearer ${token}` : '',
      apiKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    },
  };
});

// ⚠️ CAVEAT: When using apollo client in server actions or route handlers
// Due to authentication that we provide the credential at the request header when fetching from the database, ENSURE that
// - ❌ NEVER instantiate the apollo client at module-level, sharing the client across all requests/users.
// - ✅ ALWAYS call getClient in the action instead of directly use query to avoid create multiple independent `ApolloClient` instance.
export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache,
    link: authLink.concat(httpLink),
  });
});
