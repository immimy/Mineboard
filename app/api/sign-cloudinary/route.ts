import { createClient } from '@/utils/database/serverClient';
import { getCloudinaryServerClient } from '@/utils/cloudinary/server';
import { NextRequest } from 'next/server';

function getContextOwnerId(context: unknown) {
  if (typeof context !== 'string') return null;
  const ownerId = context
    .split('|')
    .find((pair) => pair.startsWith('owner_id='))
    ?.slice('owner_id='.length);
  return ownerId || null;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  // Prevents unauthorized users to upload images
  const user = data?.claims;
  if (!user) return Response.json({ signature: null }, { status: 401 });

  const { paramsToSign } = (await request.json()) as { paramsToSign?: unknown };
  if (!paramsToSign || typeof paramsToSign !== 'object')
    return Response.json({ signature: null }, { status: 400 });

  const params = paramsToSign as Record<string, unknown>;
  const ownerId = getContextOwnerId(params.context);
  const allowedUploadPreset = process.env.ALLOWED_CLOUDINARY_PRESET;

  // Limits users to only upload the assets for themselves
  // Upload preset must be in the allowlist
  if (ownerId !== user.sub || params.upload_preset !== allowedUploadPreset)
    return Response.json({ signature: null }, { status: 403 });

  // Signs the cloudinary params and returns the signature
  const cloudinary = getCloudinaryServerClient();
  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!,
  );

  return Response.json({ signature }, { status: 200 });
}
