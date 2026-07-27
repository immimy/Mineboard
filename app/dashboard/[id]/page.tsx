import BoardContainer from '@/components/BoardPage/BoardContainer';
import { createClient } from '@/utils/database/serverClient';
import { redirect } from 'next/navigation';

type BoardPageProps = {
  params: Promise<{ id: string }>;
};

async function BoardPage({ params }: BoardPageProps) {
  const [{ id }, supabase] = await Promise.all([params, createClient()]);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');

  return <BoardContainer boardId={id} userId={user.id} />;
}
export default BoardPage;
