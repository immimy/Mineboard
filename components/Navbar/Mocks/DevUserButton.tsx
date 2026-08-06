import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { signInWithEmail } from './action';
import { createClient } from '@/utils/database/serverClient';
import { UserIcon } from '@/icons/icons';
import Image from 'next/image';
import FormContainer from '@/components/global/FormContainer';
import SubmitButton from '@/components/global/SubmitButton';
import SignOutButton from '../SignOutButton';
import { Suspense } from 'react';
import { NavbarButton as LoadingSkeleton } from '@/components/Skeleton/Button';

async function DevUserButtonComponent() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return (
      <Popover>
        <PopoverButton
          aria-label='user icon'
          className='size-7 lg:size-8 hover:cursor-pointer shadow shadow-border rounded-full overflow-hidden grid place-items-center'
        >
          <UserIcon className='size-7 lg:size-8 text-foreground' />
        </PopoverButton>
        <PopoverPanel
          anchor='bottom end'
          className='z-60 min-w-30 mt-2.5 flex flex-col bg-muted text-muted-foreground rounded rounded-t-none shadow shadow-border'
        >
          {/* OWNER */}
          <FormContainer action={signInWithEmail}>
            <input type='hidden' name='email' value='demo@example.com' />
            <SubmitButton
              text='Owner'
              className='px-6 py-1.5 hover:bg-background hover:text-foreground'
            />
          </FormContainer>
          {/* RLS */}
          <FormContainer action={signInWithEmail}>
            <input type='hidden' name='email' value='rls@example.com' />
            <SubmitButton
              text='RLS'
              className='px-6 py-1.5 hover:bg-background hover:text-foreground'
            />
          </FormContainer>
        </PopoverPanel>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverButton className='size-7 lg:size-8 hover:cursor-pointer shadow shadow-border rounded-full overflow-hidden grid place-items-center'>
        <Image
          loading='eager'
          width={32}
          height={32}
          src={data?.user?.user_metadata?.avatar_url}
          alt={data?.user?.email || 'avatar'}
          className='size-7 lg:size-8 rounded-full'
        />
      </PopoverButton>
      <PopoverPanel
        anchor='bottom end'
        className='z-60 min-w-30 mt-2.5 flex flex-col bg-muted hover:bg-background text-muted-foreground rounded rounded-t-none shadow shadow-border'
      >
        <SignOutButton />
      </PopoverPanel>
    </Popover>
  );
}

function DevUserButton() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DevUserButtonComponent />
    </Suspense>
  );
}
export default DevUserButton;
