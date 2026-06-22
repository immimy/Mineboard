import Container from '../global/Container';
import NavbarRight from './NavbarRight';
import NavbarLeft from './NavbarLeft';

function Navbar() {
  return (
    <nav className='py-2 bg-neutral text-neutral-foreground sticky top-0 z-10'>
      <Container className='flex justify-between items-center'>
        {/* LEFT */}
        <NavbarLeft />
        {/* RIGHT */}
        <NavbarRight />
      </Container>
    </nav>
  );
}
export default Navbar;
