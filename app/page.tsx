import ErrorToast from '@/components/Homepage/ErrorToast';
import DemoWorkspace from '@/components/Homepage/DemoWorkspace';
import { getDemoWorkspaceData } from '@/utils/demo/homepage';
import { Suspense } from 'react';

export default async function Home() {
  const { query } = await getDemoWorkspaceData();

  return (
    <>
      <Suspense>
        <ErrorToast />
      </Suspense>

      {/* Demo Display */}
      <DemoWorkspace query={query} />
    </>
  );
}
