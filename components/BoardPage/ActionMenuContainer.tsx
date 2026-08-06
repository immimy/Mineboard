'use client';

import { useBoardTitleActions } from '@/components/Mutation/Board/Title/BoardTitleContext';
import {
  FileExcelFillIcon,
  GearIcon,
  PencilIcon,
  TrashIcon,
} from '@/icons/icons';
import type { ActionFunction, ActionMenuId } from '@/types/app';
import { useState, type ComponentType } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import type {
  AllBoardsQuery as AllBoardsQueryData,
  AllBoardsQueryVariables,
} from '@/gql/__generated__/graphql';
import {
  AllBoardsQuery,
  getAllBoardsQueryConfig,
  getSingleBoardQueryConfig,
} from '@/gql/queries';
import { deleteBoard } from '@/utils/actions/board';
import AddCardActionButton from './ActionButtons/AddCardActionButton';
import ActionMenu from './ActionMenu';
import { useListFieldDialogActions } from '../Mutation/Context/ListFieldDialogContext';
import { useCardDeletionsContext } from './CardDeletionsContext';
import ConfirmActionDialog from '../global/ConfirmActionDialog';
import { useBoardContext } from './BoardContext';

export type ActionMenuItem = {
  id: ActionMenuId;
  title: string;
  Icon: ComponentType<{ className?: string }>;
  onAction: () => void;
};

function ActionMenuContainer() {
  const client = useApolloClient();
  const router = useRouter();

  const { boardId, userId } = useBoardContext();
  const { openListFieldDialog } = useListFieldDialogActions();
  const { startUpdating: startUpdatingBoardTitle } = useBoardTitleActions();
  const { setDeleteMode } = useCardDeletionsContext();

  // Dialog State — Confirm Board Deletion
  const [isConfirmBoardDeletionOpen, setIsConfirmBoardDeletionOpen] =
    useState(false);

  // Board deletion action
  const handleDeleteBoard: ActionFunction = async () => {
    const { error } = await deleteBoard(boardId);
    if (error) return { error };

    client.cache.batch({
      update(cache) {
        // Remove board from `AllBoardsQuery`
        if (userId) {
          const allBoardsQueryConfig = getAllBoardsQueryConfig(userId);
          cache.updateQuery<AllBoardsQueryData, AllBoardsQueryVariables>(
            {
              query: AllBoardsQuery,
              variables: allBoardsQueryConfig.variables,
            },
            (queryData) => {
              if (!queryData?.boardsCollection) return queryData;
              return {
                ...queryData,
                boardsCollection: {
                  ...queryData.boardsCollection,
                  edges: queryData.boardsCollection.edges.filter(
                    ({ node }) => node.id !== boardId,
                  ),
                },
              };
            },
          );
        }

        const singleBoardQueryConfig = getSingleBoardQueryConfig(boardId);
        // Evict each top-level collection of `SingleBoardQuery` on ROOT_QUERY.
        // Specify only this board's field variants so other cached boards stay intact.
        cache.evict({
          id: 'ROOT_QUERY',
          fieldName: 'boardsCollection',
          args: singleBoardQueryConfig.boardsCollection.args,
        });
        cache.evict({
          id: 'ROOT_QUERY',
          fieldName: 'list_fieldsCollection',
          args: singleBoardQueryConfig.listFieldsCollection.args,
        });
        cache.evict({
          id: 'ROOT_QUERY',
          fieldName: 'cardsCollection',
          args: singleBoardQueryConfig.cardsCollection.args,
        });

        // Evict `boards:id` entity from cache.
        cache.evict({
          id: cache.identify({ __typename: 'boards', id: boardId }),
        });
      },

      onWatchUpdated(watch) {
        const operationName = watch.query.definitions.find(
          (definition) => definition.kind === 'OperationDefinition',
        )?.name?.value;

        // BoardContainer is still mounted until navigation completes.
        // Do not let its now-incomplete cache result trigger a final network request.
        if (operationName === 'SingleBoard' || operationName === 'BoardTitle')
          return false;
      },
    });

    // Clearing unreachable entity from cache
    client.cache.gc();

    router.replace('/dashboard');

    return { error: null };
  };

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
      id: 'multiple-card-deletions',
      title: 'Multiple card deletions',
      Icon: FileExcelFillIcon,
      onAction: () => setDeleteMode(true),
    },
    {
      id: 'delete-board',
      title: 'Delete board',
      Icon: TrashIcon,
      onAction: () => setIsConfirmBoardDeletionOpen(true),
    },
  ];

  return (
    <div className='flex items-center gap-x-0.5'>
      {/* Add card */}
      <AddCardActionButton />
      {/* Other actions */}
      <ActionMenu actionMenuItems={actionMenuItems} />

      {/* Board deletion confirmation */}
      <ConfirmActionDialog
        isOpen={isConfirmBoardDeletionOpen}
        title='Confirm Deletion'
        description='This board will be permanently deleted. Confirm to proceed?'
        onClose={() => setIsConfirmBoardDeletionOpen(false)}
        onConfirm={handleDeleteBoard}
      />
    </div>
  );
}
export default ActionMenuContainer;
