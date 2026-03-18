'use client';

import { GoogleIcon } from '@/icons/icons';
import { FormState } from '@/types/types';
import { signInWithGoogle } from '@/utils/database/auth';
import { Button } from '@headlessui/react';
import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';

const initialState: FormState = { error: null };

function SignInButton() {
  const [state, formAction, isPending] = useActionState(
    signInWithGoogle,
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
        className='flex items-center gap-1.5 text-sm font-medium lg:gap-3 lg:text-base lg:tracking-tight'
      >
        <GoogleIcon /> Sign in with Google
      </Button>
    </form>
  );
}
export default SignInButton;
