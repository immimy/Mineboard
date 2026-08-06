import { getRequiredEnv } from './config.mjs';

export async function revalidateHomepage() {
  const productionUrl = getRequiredEnv('APP_URL');
  const secret = getRequiredEnv('REVALIDATE_SECRET');
  const url = new URL('/api/revalidate', productionUrl);

  const response = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${secret}` },
  });

  if (!response.ok) {
    const responseBody = await response.text();
    const details = responseBody ? `: ${responseBody}` : '';

    throw new Error(
      `Homepage revalidation failed with status ${response.status}${details}`,
    );
  }

  console.log('Revalidated the production homepage.');
}
