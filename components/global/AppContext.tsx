'use client';

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type AppContextValue = {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function useAppContext() {
  const state = useContext(AppContext);
  if (!state)
    throw new Error('useAppContext must be used in AppContextProvider');
  return state;
}

export default function AppContextProvider({ children }: PropsWithChildren) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const value = useMemo(
    () => ({
      isSidebarOpen,
      openSidebar,
      closeSidebar,
    }),
    [closeSidebar, isSidebarOpen, openSidebar],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
