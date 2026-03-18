import Link from 'next/link';
import Container from '../global/Container';
import ThemeToggleButton from './ThemeToggleButton';
import UserButton from './UserButton';
import { Suspense } from 'react';
import { NavbarButton as ButtonSkeleton } from '../Skeleton/Button';

function Navbar() {
  return (
    <nav className='py-2 bg-neutral text-neutral-foreground'>
      <Container className='flex justify-between items-center'>
        {/* LEFT */}
        <Link
          href='/'
          className='uppercase tracking-wider font-semibold lg:text-xl'
        >
          Mineboard
        </Link>
        {/* RIGHT */}
        <div className='flex items-center gap-x-2 lg:gap-x-3'>
          <ThemeToggleButton />
          <Suspense fallback={<ButtonSkeleton />}>
            <UserButton />
          </Suspense>
        </div>
      </Container>
    </nav>
  );
}
export default Navbar;
