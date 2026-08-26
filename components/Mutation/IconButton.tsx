'use client';

import { Button } from '@headlessui/react';
import clsx from 'clsx';

type IconButtonProps = Omit<
  React.ComponentPropsWithRef<'button'>,
  'children'
> & {
  size?: string;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
};

function IconButton({
  size = 'size-8',
  Icon,
  label,
  ref,
  type = 'button',
  title,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      ref={ref}
      type={type}
      aria-label={label}
      title={title ?? label}
      {...props}
      className={clsx(
        'grid shrink-0 place-items-center text-muted-foreground/20 dark:text-muted-foreground/40 hover:text-muted-foreground focus:text-muted-foreground hover:cursor-pointer focus:outline-none disabled:cursor-not-allowed disabled:opacity-40',
        size,
        className,
      )}
    >
      <Icon className='size-4 shrink-0' />
    </Button>
  );
}
export default IconButton;
