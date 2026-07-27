export function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function getCleanupEnvironment() {
  const environment = Deno.env.get('CLOUDINARY_CLEANUP_SCOPE');

  if (environment === 'development' || environment === 'production')
    return environment;

  throw new Error(
    'CLOUDINARY_CLEANUP_SCOPE must be "development" or "production"',
  );
}

export function getCleanupAuth(): 'secret:image_cleanup' | 'secret:default' {
  const environment = getCleanupEnvironment();

  if (environment === 'development') return 'secret:default';
  if (environment === 'production') return 'secret:image_cleanup';

  throw new Error('Failed to retrieve auth key for cleanup');
}

export function getPositiveInteger({
  name,
  fallback,
  min,
  max,
}: {
  name: string;
  fallback: number;
  min?: number;
  max?: number;
}): number {
  const value = Number(Deno.env.get(name) ?? fallback);
  if (!Number.isInteger(value) || value <= 0) return fallback;

  if (min && max && min <= value && max >= value) return value;
  if (min && min > value) return min;
  if (max && max < value) return max;

  return value;
}

export function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
  });
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
