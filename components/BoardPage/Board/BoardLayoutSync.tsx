'use client';

import BoardContainer from './BoardContainer';
import { useLayoutEffect, useState } from 'react';
import LoadingContainer from '@/components/global/LoadingContainer';
import Error from '@/components/global/Error';
import { useLayoutMutationSync } from './LayoutMutationSyncProvider';

type BoardLayoutSyncParams = { boardId: string; userId: string };

function BoardLayoutSync({ boardId, userId }: BoardLayoutSyncParams) {
  const { getPendingLayoutSave, waitForLayoutSaves } = useLayoutMutationSync();

  const [isLoading, setLoading] = useState(
    Boolean(getPendingLayoutSave(boardId)),
  );
  const [isError, setError] = useState(false);

  // Check only on entry/reappearance. Ordinary drags must not hide the board.
  useLayoutEffect(() => {
    // This `isActive` prevents the obsolete callback to update the hidden component.
    let isActive = true;
    const pendingSave = getPendingLayoutSave(boardId);

    // Recheck external save status before paint when Activity restores this gate.
    setLoading(Boolean(pendingSave)); // eslint-disable-line react-hooks/set-state-in-effect

    if (pendingSave) {
      void waitForLayoutSaves(boardId)
        .catch(() => {
          // Save failures are handled by the worker; only unexpected
          // coordination failures reach this fallback.
          if (isActive) setError(true);
        })
        .finally(() => {
          if (isActive) setLoading(false);
        });
    }

    return () => {
      isActive = false;
      setLoading(true);
      setError(false);
    };
  }, [boardId, getPendingLayoutSave, waitForLayoutSaves]);

  // Reappearance is checked synchronously before paint. Loading is only shown
  // when a previous save actually remains unfinished.
  if (isLoading) return <LoadingContainer />;
  if (isError) return <Error />;

  return <BoardContainer boardId={boardId} userId={userId} />;
}

export default BoardLayoutSync;
