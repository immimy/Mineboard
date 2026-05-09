'use client';

import { createClient } from '@/utils/database/browserClient';
import { HttpLink } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';
import { supabaseProjectUrl } from '@/utils/database/config';

function makeClient() {
  const cache = new InMemoryCache();

  const httpLink = new HttpLink({
    uri: `${supabaseProjectUrl}/graphql/v1`,
    fetchOptions: { cache: 'no-store' },
  });

  const authLink = new SetContextLink(async (prevContext) => {
    const supabase = createClient();
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    return {
      headers: {
        ...prevContext.headers,
        Authorization: token ? `Bearer ${token}` : '',
        apiKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      },
    };
  });

  return new ApolloClient({
    cache,
    link: authLink.concat(httpLink),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
