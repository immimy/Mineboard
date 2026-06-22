import LoadingContainer from '@/components/global/LoadingContainer';
import DashboardSidebarContainer from '@/components/Sidebar/DashboardSidebarContainer';
import { PropsWithChildren, Suspense } from 'react';

function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<LoadingContainer />}>
      <DashboardSidebarContainer />
      {children}
    </Suspense>
  );
}
export default DashboardLayout;
