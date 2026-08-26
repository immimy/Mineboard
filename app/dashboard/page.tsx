import BoardsContainer from '@/components/DashboardPage/BoardsContainer';
import { createClient } from '@/utils/database/serverClient';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

async function DashboardPage() {
  return (
    <Suspense>
      <DashboardPageContainer />
    </Suspense>
  );
}
export default DashboardPage;

async function DashboardPageContainer() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/');
  return <BoardsContainer userId={data.user.id} />;
}
