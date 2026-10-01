'use client';

import { createContext, type PropsWithChildren, useContext } from 'react';

const DashboardUserContext = createContext<string | undefined>(undefined);

export function useDashboardUserId() {
  const userId = useContext(DashboardUserContext);

  if (!userId) {
    throw new Error('useDashboardUserId must be used in DashboardUserProvider');
  }

  return userId;
}

type DashboardUserProviderProps = PropsWithChildren<{ userId: string }>;

function DashboardUserProvider({
  children,
  userId,
}: DashboardUserProviderProps) {
  return (
    <DashboardUserContext.Provider value={userId}>
      {children}
    </DashboardUserContext.Provider>
  );
}

export default DashboardUserProvider;
