'use client';

import { MoonIcon, SunIcon } from '@/icons/icons';
import { Theme } from '@/types/app';
import { Button } from '@headlessui/react';
import { MouseEventHandler, Suspense, useEffect, useState } from 'react';
import { NavbarButton as LoadingSkeleton } from '../Skeleton/Button';

function ThemeToggleButtonComponent() {
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
    if (isPrefersDarkScheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- init-on-mount: reads localStorage/matchMedia once, not a cascading render
    setIsDarkTheme(isPrefersDarkScheme);
  }, []);

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
      className='size-7 lg:size-8 bg-neutral text-accent rounded-full shadow shadow-border grid place-items-center hover:cursor-pointer'
      onClick={toggleThemeHandler}
    >
      {isDarkTheme ? (
        <MoonIcon className='size-4 lg:size-5' />
      ) : (
        <SunIcon className='size-4 lg:size-5' />
      )}
    </Button>
  );
}

function ThemeToggleButton() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ThemeToggleButtonComponent />
    </Suspense>
  );
}
export default ThemeToggleButton;
