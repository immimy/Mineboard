import { PlusSquareIcon } from '@/icons/icons';
import ActionButtonBase from './ActionButtonBase';
import { useBoardContext } from '../BoardContext';

function AddNewCardActionButton() {
  const { dbListFields, openAddCard } = useBoardContext();
  return (
    <ActionButtonBase
      title='Add new card'
      Icon={PlusSquareIcon}
      onClick={openAddCard}
      disabled={!dbListFields?.length}
      tooltip='Create a list field before adding cards.'
    />
  );
}
export default AddNewCardActionButton;
