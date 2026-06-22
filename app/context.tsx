'use client';

import type { ActionMenuId } from '@/types/app';
import { createContext, useCallback, useContext, useState } from 'react';

/** CONTEXT */

type ContextType = {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  activeActionId: ActionMenuId;
  setActiveActionId: (actionId: ActionMenuId) => void;
};

const AppContext = createContext<undefined | ContextType>(undefined);

export const useAppContext = () => {
  const state = useContext(AppContext);
  if (!state) throw new Error('useAppContext must be used in AppProvider');
  return state;
};

/** PROPS */

type AppContextProps = {} & React.PropsWithChildren;

/** TYPES */

function AppContextWrapper({ children }: AppContextProps) {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeActionId, setActiveActionId] =
    useState<ActionMenuId>('add-new-card');

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        openSidebar,
        closeSidebar,
        activeActionId,
        setActiveActionId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export default AppContextWrapper;
