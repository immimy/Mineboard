import { GearIcon } from '@/icons/icons';
import { useBoardContext } from '../BoardContext';
import ActionButtonBase from './ActionButtonBase';

function CustomListFieldsActionButton() {
  const { openAddListField } = useBoardContext();

  return (
    <ActionButtonBase
      title='Custom list fields'
      Icon={GearIcon}
      onClick={openAddListField}
    />
  );
}
export default CustomListFieldsActionButton;
