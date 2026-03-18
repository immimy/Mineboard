'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

function ErrorToast() {
  const search = useSearchParams();
  const error = search.get('error');

  useEffect(() => {
    if (!error) return;
    toast.error(error);
  }, [error]);

  return null;
}
export default ErrorToast;
