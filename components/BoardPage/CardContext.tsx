'use client';

import { ColorPalette } from '@/types/jsonbSchema';
import { createContext, useContext } from 'react';

/** CONTEXT */

type ContextType = { color: ColorPalette };

const CardContext = createContext<undefined | ContextType>(undefined);

export const useCardContext = () => {
  const state = useContext(CardContext);
  if (!state) throw new Error('useCardContext must be used in BoardProvider');
  return state;
};

/** PROPS */

type CardContextProps = {
  color: ColorPalette;
} & React.PropsWithChildren;

function CardContextProvider({ children, color }: CardContextProps) {
  return (
    <CardContext.Provider value={{ color }}>{children}</CardContext.Provider>
  );
}
export default CardContextProvider;
