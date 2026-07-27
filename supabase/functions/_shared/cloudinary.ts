import { getRequiredEnv } from './utils.ts';

const cloudinaryCloudName = getRequiredEnv('CLOUDINARY_CLOUD_NAME');
const cloudinaryApiKey = getRequiredEnv('CLOUDINARY_API_KEY');
const cloudinaryApiSecret = getRequiredEnv('CLOUDINARY_API_SECRET');
const cloudinaryApiBaseUrl = `https://api.cloudinary.com/v1_1/${encodeURIComponent(
  cloudinaryCloudName,
)}`;
const cloudinaryAuthorization = `Basic ${btoa(
  `${cloudinaryApiKey}:${cloudinaryApiSecret}`,
)}`;

// ——— Types ———————————————————————————————————————————————————

type CloudinaryResponse = Record<string, unknown>;

type CloudinaryJsonError = { error: { message: string } };

export type DeleteResourcesResult = {
  deleted: Record<string, string>;
};

export type SearchResource = {
  public_id: string;
};

// ——— Helpers ———————————————————————————————————————————————————

function readCloudinaryJsonError(data: CloudinaryJsonError): string | null {
  const {
    error: { message },
  } = data;
  if (!message) return null;
  return typeof message === 'string' ? message : null;
}

async function cloudinaryRequest(
  path: string,
  init: RequestInit,
): Promise<CloudinaryResponse> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', cloudinaryAuthorization);

  const response = await fetch(`${cloudinaryApiBaseUrl}${path}`, {
    ...init,
    headers,
  });
  const result = await response.json();

  if (!response.ok) {
    const message =
      readCloudinaryJsonError(result) ??
      `${response.status} ${response.statusText}`.trim();
    throw new Error(`Cloudinary request failed: ${message}`);
  }

  if (!result || typeof result !== 'object' || Array.isArray(result))
    throw new Error(
      `Expected JSON but Cloudinary returned an invalid response (${response.status} ${response.statusText})`,
    );

  return result as CloudinaryResponse;
}

// ——— Custom Cloudinary Requests ——————————————————————————————————————
// Sends request with native fetch instead using SDK.
// Admin API of Cloudinary SDK is incompatible in Deno runtime.

// Search Cloudinary resources
export async function searchCloudinaryResources({
  expression,
  maxResults,
}: {
  expression: string;
  maxResults: number;
}): Promise<SearchResource[]> {
  const result = await cloudinaryRequest('/resources/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      expression,
      sort_by: [{ created_at: 'asc' }],
      max_results: maxResults,
    }),
  });

  if (!Array.isArray(result.resources))
    throw new Error('Cloudinary search response has invalid resources');

  return result.resources.map((resource) => {
    const { public_id } = resource;

    if (!public_id || typeof public_id !== 'string')
      throw new Error('Cloudinary search returned an invalid resource');

    return { public_id };
  });
}

// Remove Cloudinary tag
export async function removeCloudinaryTag(
  tag: string,
  publicIds: string[],
): Promise<void> {
  const body = new URLSearchParams({
    command: 'remove',
    tag,
  });

  for (const publicId of publicIds) body.append('public_ids[]', publicId);

  await cloudinaryRequest('/image/tags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
}

// Delete Cloudinary resources
export async function deleteCloudinaryResources(
  publicIds: string[],
): Promise<DeleteResourcesResult> {
  const body = new URLSearchParams();
  for (const publicId of publicIds) body.append('public_ids[]', publicId);

  const result = await cloudinaryRequest('/resources/image/upload', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const { deleted } = result;

  if (!deleted || typeof deleted !== 'object' || Array.isArray(deleted))
    throw new Error('Cloudinary deletion response has invalid statuses');

  return { deleted } as DeleteResourcesResult;
}
