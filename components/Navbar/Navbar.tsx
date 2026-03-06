import Link from 'next/link';
import Container from '../global/Container';
import ThemeToggleButton from './ThemeToggleButton';
import UserButton from './UserButton';

function Navbar() {
  return (
    <nav className='py-2 bg-neutral text-neutral-foreground'>
      <Container className='flex justify-between items-center'>
        {/* LEFT */}
        <Link href='/' className='uppercase tracking-wider font-semibold'>
          Mineboard
        </Link>
        {/* RIGHT */}
        <div className='flex items-center gap-x-1.5'>
          <ThemeToggleButton />
          <UserButton />
        </div>
      </Container>
    </nav>
  );
}
export default Navbar;
