'use client';

import { Button } from '@headlessui/react';
import clsx from 'clsx';

type IconButtonProps = {
  type?: 'button' | 'submit';
  size?: string;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  title?: string;
  onClick: (() => void) | undefined;
  disabled?: boolean;
  className?: string;
};

function IconButton({
  type = 'button',
  size = 'size-8',
  Icon,
  label,
  title,
  onClick,
  disabled = false,
  className,
}: IconButtonProps) {
  return (
    <Button
      type={type}
      aria-label={label}
      title={title ?? label}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'grid place-items-center text-muted-foreground/20 dark:text-muted-foreground/40 hover:text-muted-foreground focus:text-muted-foreground hover:cursor-pointer focus:outline-none disabled:cursor-not-allowed disabled:opacity-40',
        size,
        className,
      )}
    >
      <Icon className='size-4 shrink-0' />
    </Button>
  );
}
export default IconButton;
