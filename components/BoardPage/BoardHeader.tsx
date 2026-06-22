import ActionMenuContainer from './ActionMenuContainer';

function BoardHeader() {
  return (
    <div className='py-1 border-b border-border flex justify-end items-center sticky top-11 lg:top-12 bg-background -mx-1.5'>
      {/* Action Menu */}
      <ActionMenuContainer />
    </div>
  );
}
export default BoardHeader;
