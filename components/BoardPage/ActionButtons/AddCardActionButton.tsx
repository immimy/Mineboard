import { PlusIcon } from '@/icons/icons';
import ActionButtonBase from './ActionButtonBase';
import { useBoardContext } from '../BoardContext';
import { useAddCardDialogActions } from '../../Mutation/Context/AddCardDialogContext';

function AddCardActionButton() {
  const { dbListFields } = useBoardContext();
  const { openAddCard } = useAddCardDialogActions();
  return (
    <ActionButtonBase
      title='Add new card'
      Icon={PlusIcon}
      onClick={openAddCard}
      disabled={!dbListFields?.length}
      tooltip='Create a list field before adding cards.'
    />
  );
}
export default AddCardActionButton;
