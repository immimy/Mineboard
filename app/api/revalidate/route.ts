import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return Response.json(
      { error: 'Homepage revalidation is not configured' },
      { status: 500 },
    );
  }

  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  revalidatePath('/');

  return Response.json({ revalidated: true });
}
