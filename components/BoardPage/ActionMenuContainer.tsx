'use client';

import { useBoardTitleActions } from '@/components/Mutation/Board/Title/BoardTitleContext';
import { GearIcon, PencilIcon, TrashIcon } from '@/icons/icons';
import type { ActionMenuId } from '@/types/app';
import type { ComponentType } from 'react';
import { toast } from 'react-toastify';
import AddCardActionButton from './ActionButtons/AddCardActionButton';
import ActionMenu from './ActionMenu';
import { useListFieldDialogActions } from '../Mutation/Context/ListFieldDialogContext';

export type ActionMenuItem = {
  id: ActionMenuId;
  title: string;
  Icon: ComponentType<{ className?: string }>;
  onAction: () => void;
};

function ActionMenuContainer() {
  const { openListFieldDialog } = useListFieldDialogActions();
  const { startUpdating: startUpdatingBoardTitle } = useBoardTitleActions();

  const actionMenuItems: ActionMenuItem[] = [
    {
      id: 'edit-board-title',
      title: 'Edit board title',
      Icon: PencilIcon,
      onAction: startUpdatingBoardTitle,
    },
    {
      id: 'custom-list-fields',
      title: 'Custom list fields',
      Icon: GearIcon,
      onAction: openListFieldDialog,
    },
    {
      id: 'delete-board',
      title: 'Delete board',
      Icon: TrashIcon,
      onAction: () => toast.info('Delete board action selected'),
    },
  ];

  return (
    <div className='flex items-center gap-x-0.5'>
      <AddCardActionButton />
      <ActionMenu actionMenuItems={actionMenuItems} />
    </div>
  );
}
export default ActionMenuContainer;
