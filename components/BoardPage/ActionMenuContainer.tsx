'use client';

import { useAppContext } from '@/app/context';
import { GearIcon, PencilIcon, PlusSquareIcon } from '@/icons/icons';
import type { ActionMenuId } from '@/types/app';
import type { ComponentType } from 'react';
import AddNewCardActionButton from './ActionButtons/AddNewCardActionButton';
import CustomListFieldsActionButton from './ActionButtons/CustomListFieldsActionButton';
import EditBoardTitleActionButton from './ActionButtons/EditBoardTitleActionButton';
import ActionMenu from './ActionMenu';

export type ActionMenuItem = {
  id: ActionMenuId;
  title: string;
  Icon: ComponentType<{ className?: string }>;
};

type ActionMenuItemConfig = ActionMenuItem & {
  id: ActionMenuId;
  ActionButton: ComponentType;
};

const actionMenuItems: ActionMenuItemConfig[] = [
  {
    id: 'edit-board-title',
    title: 'Edit board title',
    Icon: PencilIcon,
    ActionButton: EditBoardTitleActionButton,
  },
  {
    id: 'custom-list-fields',
    title: 'Custom list fields',
    Icon: GearIcon,
    ActionButton: CustomListFieldsActionButton,
  },
  {
    id: 'add-new-card',
    title: 'Add new card',
    Icon: PlusSquareIcon,
    ActionButton: AddNewCardActionButton,
  },
];

function ActionMenuContainer() {
  const { activeActionId, setActiveActionId } = useAppContext();
  const activeAction =
    actionMenuItems.find((item) => item.id === activeActionId) ??
    actionMenuItems[0];
  const ActiveActionButton = activeAction.ActionButton;

  return (
    <div className='flex items-center gap-x-0.5'>
      <ActiveActionButton />
      <ActionMenu
        actionMenuItems={actionMenuItems}
        activeActionId={activeActionId}
        onSelectAction={setActiveActionId}
      />
    </div>
  );
}
export default ActionMenuContainer;
