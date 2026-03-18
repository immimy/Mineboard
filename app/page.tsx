import ErrorToast from '@/components/Homepage/ErrorToast';
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <Suspense>
        <ErrorToast />
      </Suspense>
    </>
  );
}
