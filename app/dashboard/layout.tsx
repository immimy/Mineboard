import { PropsWithChildren, Suspense } from 'react';

function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Suspense>
      {/* Sidebar */}
      {children}
    </Suspense>
  );
}
export default DashboardLayout;
