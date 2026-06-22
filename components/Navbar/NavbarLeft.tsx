import SidebarButton from '../Sidebar/SidebarButton';
import BoardBadge from './BoardBadge';

function NavbarLeft() {
  return (
    <div className='flex justify-center items-center space-x-2'>
      <SidebarButton />
      <BoardBadge />
    </div>
  );
}
export default NavbarLeft;
