'use client';

import { LoadingIcon, MoonIcon, SunIcon } from '@/icons/icons';
import { Theme } from '@/types/types';
import { Button } from '@headlessui/react';
import { MouseEventHandler, useEffect, useState } from 'react';

function ThemeToggleButton() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Add or Remove "dark" class from the root based on scheme preference
  useEffect(() => {
    const preferredScheme: Theme =
      // Get scheme from local storage
      (localStorage.getItem('prefers-scheme') as Theme) ??
      // Get scheme from match media by default
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light');
    const isPrefersDarkScheme = preferredScheme === 'dark';
    isPrefersDarkScheme
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark');
    setIsLoaded(true);
    setIsDarkTheme(isPrefersDarkScheme);
  }, []);

  // Loading scheme preference skeleton...
  if (!isLoaded)
    return (
      <Button className='p-1.5 rounded-full shadow shadow-border/70'>
        <LoadingIcon className='size-4 text-border' />
      </Button>
    );

  //  Toggle Theme
  const toggleThemeHandler: MouseEventHandler<HTMLButtonElement> = () => {
    const newScheme: Theme = isDarkTheme ? 'light' : 'dark';
    localStorage.setItem('prefers-scheme', newScheme);
    document.documentElement.classList.toggle('dark');
    setIsDarkTheme(newScheme === 'dark');
  };

  return (
    <Button
      aria-label='theme toggle'
      className='p-1.5 rounded-full shadow shadow-border/70 hover:cursor-pointer'
      onClick={toggleThemeHandler}
    >
      {isDarkTheme ? (
        <MoonIcon className='size-4 text-accent' />
      ) : (
        <SunIcon className='size-4 text-accent' />
      )}
    </Button>
  );
}
export default ThemeToggleButton;
