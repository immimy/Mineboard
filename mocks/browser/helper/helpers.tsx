import { render } from 'vitest-browser-react';
import { Suspense } from 'react';

/**
 * Resolves an async Server Component into a React element,
 * then renders it inside a Suspense boundary so Vitest
 * doesn't throw on the uncached promise.
 */
export async function renderAsync(asyncComponent: Promise<React.ReactElement>) {
  const resolved = await asyncComponent;

  return render(
    <Suspense fallback={<div data-testid='suspense-fallback'>Loading...</div>}>
      {resolved}
    </Suspense>,
  );
}
