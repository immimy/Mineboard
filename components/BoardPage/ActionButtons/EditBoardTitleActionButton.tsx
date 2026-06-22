import { PencilIcon } from '@/icons/icons';
import { toast } from 'react-toastify';
import ActionButtonBase from './ActionButtonBase';

function EditBoardTitleActionButton() {
  return (
    <ActionButtonBase
      title='Edit board title'
      Icon={PencilIcon}
      onClick={() => toast.info('Edit board title action selected')}
    />
  );
}
export default EditBoardTitleActionButton;
