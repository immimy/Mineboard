import { Button } from '@headlessui/react';
import clsx from 'clsx';
import type { ComponentType } from 'react';

type ActionButtonBaseProps = {
  title: string;
  Icon: ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
};

function ActionButtonBase({
  title,
  Icon,
  onClick,
  disabled = false,
  tooltip,
}: ActionButtonBaseProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      aria-label={title}
      title={disabled ? tooltip : undefined}
      className={clsx(
        'flex min-h-8 items-center gap-2 rounded-l-xl border border-border/50 bg-background px-3 text-sm font-semibold text-foreground shadow-sm shadow-border/70 transition focus:outline-none data-focus:ring-2 data-focus:ring-accent/50 data-focus:ring-offset-2 data-focus:ring-offset-neutral md:min-h-9',
        disabled
          ? 'cursor-not-allowed opacity-60 border-border'
          : 'hover:cursor-pointer hover:bg-accent/90',
      )}
    >
      <Icon className='size-4 shrink-0' />
      <span>{title}</span>
    </Button>
  );
}
export default ActionButtonBase;
