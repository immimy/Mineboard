import ErrorToast from '@/components/Homepage/ErrorToast';
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <Suspense>
        {/* TO-DO: Demo Sidebar */}
        <ErrorToast />
      </Suspense>
    </>
  );
}
