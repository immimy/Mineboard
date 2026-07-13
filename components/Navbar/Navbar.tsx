import Container from '../global/Container';
import NavbarRight from './NavbarRight';
import NavbarLeft from './NavbarLeft';

function Navbar() {
  return (
    <nav className='sticky top-0 z-50 h-(--nav-height) max-h-(--nav-height) overflow-hidden bg-neutral text-neutral-foreground'>
      <Container className='h-full min-h-0 flex justify-between items-center gap-x-6'>
        {/* LEFT */}
        <NavbarLeft />
        {/* RIGHT */}
        <NavbarRight />
      </Container>
    </nav>
  );
}
export default Navbar;
