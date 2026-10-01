'use client';

import { useDashboardUserId } from '@/components/DashboardPage/DashboardUserContext';
import { redirect, useParams } from 'next/navigation';
import BoardLayoutSync from './BoardLayoutSync';

function DashboardBoardContainer() {
  const userId = useDashboardUserId();
  const { id: boardId } = useParams();

  if (!boardId || typeof boardId === 'object') return redirect('/dashboard');

  return <BoardLayoutSync key={boardId} boardId={boardId} userId={userId} />;
}

export default DashboardBoardContainer;
