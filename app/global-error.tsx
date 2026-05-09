'use client';

import Image from 'next/image';
import errorImage from '@/public/images/error.svg';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <html>
      <body className='min-h-screen grid justify-center items-center'>
        <div className='text-center'>
          <Image
            src={errorImage}
            alt='an error occurred'
            className='w-xl max-w-full'
          />
          <h1 className='mb-4 text-2xl font-semibold tracking-wider'>
            Some thing went wrong!
          </h1>
          <button
            onClick={() => reset()}
            className='px-8 py-2 rounded shadow shadow-border bg-muted text-muted-foreground font-medium tracking-wide dark:bg-background dark:text-foreground'
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
