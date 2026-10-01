import DashboardUserProvider from '@/components/DashboardPage/DashboardUserContext';
import DashboardSidebar from '@/components/Sidebar/DashboardSidebar';
import { createClient } from '@/utils/database/serverClient';
import { redirect } from 'next/navigation';
import { PropsWithChildren, Suspense } from 'react';

function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Suspense>
      <AuthenticatedDashboard>{children}</AuthenticatedDashboard>
    </Suspense>
  );
}

async function AuthenticatedDashboard({ children }: PropsWithChildren) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');

  return (
    <DashboardUserProvider userId={user.id}>
      <DashboardSidebar />
      {children}
    </DashboardUserProvider>
  );
}

export default DashboardLayout;
