import { createClient } from '@/utils/database/serverClient';
import DashboardSidebar from './DashboardSidebar';
import { redirect } from 'next/navigation';

async function DashboardSidebarContainer() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user?.id) return redirect('/');
  return <DashboardSidebar userId={data.user?.id} />;
}
export default DashboardSidebarContainer;
