'use client';

import { FormState } from '@/types/types';
import { signOutWithGoogle } from '@/utils/database/auth';
import { Button } from '@headlessui/react';
import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';

const initialState: FormState = { error: null };

function SignOutButton() {
  const [state, formAction, isPending] = useActionState(
    signOutWithGoogle,
    initialState,
  );

  useEffect(() => {
    if (!state.error) return;
    toast.error(state.error);
  }, [state.error]);

  return (
    <form action={formAction}>
      <Button
        type='submit'
        disabled={isPending}
        className='text-sm font-medium lg:text-base lg:tracking-tight'
      >
        Sign Out
      </Button>
    </form>
  );
}
export default SignOutButton;
