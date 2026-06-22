import BoardsContainer from '@/components/DashboardPage/BoardsContainer';
import { createClient } from '@/utils/database/serverClient';
import { redirect } from 'next/navigation';

async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/');
  return <BoardsContainer userId={data.user.id} />;
}
export default DashboardPage;
