import { createClient } from '@/utils/database/adminClient';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const identifier = process.env.DEMO_HOMEPAGE_IDENTIFIER;

  if (!identifier)
    return NextResponse.json({
      error: 'Identifier is not configured.',
      status: 500,
    });

  const result = await supabase
    .from('boards')
    .select('title', { count: 'exact', head: true })
    .eq('user_id', identifier);

  if (!result.success)
    return NextResponse.json({
      error: result.error.message,
      status: 500,
    });

  return NextResponse.json({
    message: `Demo user has ${result.count} boards.`,
  });
}
