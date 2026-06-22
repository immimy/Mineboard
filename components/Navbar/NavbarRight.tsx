import ThemeToggleButton from './ThemeToggleButton';
import UserButton from './UserButton';
import DevUserButton from './Mocks/DevUserButton';

function NavbarRight() {
  const isProduction = process.env.VERCEL_ENV === 'production';
  return (
    <div className='flex items-center gap-x-2 lg:gap-x-3'>
      <ThemeToggleButton />
      {isProduction ? <UserButton /> : <DevUserButton />}
    </div>
  );
}
export default NavbarRight;
