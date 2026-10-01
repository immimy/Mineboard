'use client';

import { ColorPalette } from '@/types/jsonbSchema';
import { createContext, useContext, useMemo } from 'react';

/** CONTEXT */

type ContextType = {
  cardId: string;
  title: string;
  color: ColorPalette;
};

const CardContext = createContext<undefined | ContextType>(undefined);

export const useCardContext = () => {
  const state = useContext(CardContext);
  if (!state) throw new Error('useCardContext must be used in BoardProvider');
  return state;
};

/** PROPS */

type CardContextProps = {
  cardId: string;
  title: string;
  color: ColorPalette;
} & React.PropsWithChildren;

function CardContextProvider({
  children,
  cardId,
  title,
  color,
}: CardContextProps) {
  const value = useMemo(
    () => ({ cardId, title, color }),
    [cardId, title, color],
  );

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
}
export default CardContextProvider;
