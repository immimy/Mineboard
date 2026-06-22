import { LoadingIcon } from '@/icons/icons';

export function NavbarButton() {
  return (
    <div className='bg-neutral text-muted-foreground rounded-full shadow shadow-border grid place-items-center size-7 lg:size-8'>
      <LoadingIcon className='size-4 lg:size-5' />
    </div>
  );
}

export function NavbarBadge() {
  return (
    <div className='min-w-12 max-w-24 flex justify-center items-center'>
      <LoadingIcon />
    </div>
  );
}
