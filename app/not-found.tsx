import Image from 'next/image';
import errorImage from '@/public/images/error.svg';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='py-16 text-center grid place-items-center gap-4 text-foreground'>
      <Image
        src={errorImage}
        alt='an error occurred'
        className='w-xl max-w-full'
      />
      <h1 className='text-2xl font-semibold tracking-wider'>
        Some thing went wrong!
      </h1>
      <Link
        href='/'
        className='px-8 py-2 rounded shadow shadow-border bg-muted text-muted-foreground font-medium tracking-wide dark:bg-background dark:text-foreground'
      >
        Back to homepage
      </Link>
    </div>
  );
}
