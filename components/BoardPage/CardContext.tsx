'use client';

import { ColorPalette } from '@/types/jsonbSchema';
import { createContext, useContext } from 'react';

/** CONTEXT */

type ContextType = { isPreview: boolean; title: string; color: ColorPalette };

const CardContext = createContext<undefined | ContextType>(undefined);

export const useCardContext = () => {
  const state = useContext(CardContext);
  if (!state) throw new Error('useCardContext must be used in BoardProvider');
  return state;
};

/** PROPS */

type CardContextProps = {
  isPreview: boolean;
  title: string;
  color: ColorPalette;
} & React.PropsWithChildren;

function CardContextProvider({
  children,
  isPreview,
  title,
  color,
}: CardContextProps) {
  return (
    <CardContext.Provider value={{ isPreview, title, color }}>
      {children}
    </CardContext.Provider>
  );
}
export default CardContextProvider;
