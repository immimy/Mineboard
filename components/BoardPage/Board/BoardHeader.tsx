import ActionMenuContainer from '../ActionMenu/ActionMenuContainer';
import { useCardDeletionMode } from '../Card/CardDeletionsContext';
import CardDeletions from '../Card/CardDeletions';

function BoardHeader() {
  const isDeleteMode = useCardDeletionMode();
  return (
    <div className='py-1 border-b border-border flex justify-end items-center sticky top-(--nav-height) bg-background -mx-1.5 z-50'>
      {/* Action Menu */}
      {!isDeleteMode && <ActionMenuContainer />}

      {/* Multiple card deletions */}
      {isDeleteMode && <CardDeletions />}
    </div>
  );
}
export default BoardHeader;
