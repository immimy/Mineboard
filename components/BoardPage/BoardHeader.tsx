import ActionMenuContainer from './ActionMenuContainer';

function BoardHeader() {
  return (
    <div className='py-1 border-b border-border flex justify-end items-center sticky top-(--nav-height) bg-background -mx-1.5 z-50'>
      {/* Action Menu */}
      <ActionMenuContainer />
    </div>
  );
}
export default BoardHeader;
