import 'server-only';

import type { User } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const renderError = (error: unknown, defaultMessage?: string) => {
  const errorMessage =
    error instanceof Error
      ? error.message
      : defaultMessage || 'An error occurred';
  return { data: null, error: errorMessage };
};

export function revalidateDemoHomepage(user: Pick<User, 'id'>) {
  const demoUserId = z
    .uuid()
    .safeParse(process.env.DEMO_HOMEPAGE_IDENTIFIER?.trim());

  if (demoUserId.success && user.id === demoUserId.data) {
    revalidatePath('/');
  }
}
