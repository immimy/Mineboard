import 'server-only';

import { type DemoHomepageQuery as DemoHomepageQueryData } from '@/gql/__generated__/graphql';
import { createAdminApolloClient } from '@/gql/apollo/AdminApolloClient';
import {
  DemoHomepageQuery,
  getDemoHomepageQueryConfig,
} from '@/utils/demo/graphql';
import { cacheLife } from 'next/cache';
import { z } from 'zod';

function getDemoUserId() {
  const identifier = process.env.DEMO_HOMEPAGE_IDENTIFIER?.trim();
  const result = z.uuid().safeParse(identifier);

  if (!result.success) {
    throw new Error(
      'DEMO_HOMEPAGE_IDENTIFIER must contain a valid Supabase user UUID',
    );
  }

  return result.data;
}

export type DemoWorkspaceData = {
  userId: string;
  query: DemoHomepageQueryData;
};

export async function getDemoWorkspaceData(): Promise<DemoWorkspaceData> {
  'use cache';
  cacheLife('max');

  const userId = getDemoUserId();
  const apollo = createAdminApolloClient();
  const queryConfig = getDemoHomepageQueryConfig(userId);

  const { data, error } = await apollo.query({
    query: DemoHomepageQuery,
    variables: queryConfig.variables,
    fetchPolicy: 'no-cache',
  });

  if (error) throw new Error(`Could not load demo boards: ${error.message}`);
  if (!data) throw new Error('Demo boards returned no data');

  return { userId, query: data };
}
