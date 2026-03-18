import { createClient } from '@/utils/database/serverClient';
import SignOutButton from './SignOutButton';
import SignInButton from './SingInButton';
import Image from 'next/image';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { UserIcon } from '@/icons/icons';

async function UserButton() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return (
      <Popover className='relative flex items-center'>
        <PopoverButton
          aria-label='user icon'
          className='size-7 lg:size-8 hover:cursor-pointer shadow shadow-border rounded-full overflow-hidden grid place-items-center'
        >
          <UserIcon className='size-7 lg:size-8 text-foreground' />
        </PopoverButton>
        <PopoverPanel
          anchor='bottom end'
          className='mt-2.5 px-6 py-2 flex flex-col bg-muted/70 hover:bg-background text-muted-foreground rounded rounded-t-none shadow shadow-border'
        >
          <SignInButton />
        </PopoverPanel>
      </Popover>
    );
  }

  return (
    <Popover className='relative flex items-center'>
      <PopoverButton className='size-7 lg:size-8 hover:cursor-pointer shadow shadow-border rounded-full overflow-hidden grid place-items-center'>
        <Image
          width={32}
          height={32}
          src={data?.user?.user_metadata?.avatar_url}
          alt={data?.user?.email || 'avatar'}
          className='size-7 lg:size-8 rounded-full'
        />
      </PopoverButton>
      <PopoverPanel
        anchor='bottom end'
        className='mt-2.5 px-6 py-2 flex flex-col bg-muted/70 hover:bg-background text-muted-foreground rounded rounded-t-none shadow shadow-border'
      >
        <SignOutButton />
      </PopoverPanel>
    </Popover>
  );
}
export default UserButton;
