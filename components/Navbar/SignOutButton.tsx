'use client';

import { FormState } from '@/types/app';
import { signOutWithGoogle } from '@/utils/database/auth';
import { useApolloClient } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import FormContainer from '../global/FormContainer';
import SubmitButton from '../global/SubmitButton';

function SignOutButton() {
  const client = useApolloClient();
  const { replace } = useRouter();

  const signOutAction = async (formState: FormState): Promise<FormState> => {
    const { error } = await signOutWithGoogle();
    if (error) return { ...formState, error };
    await client.clearStore();
    replace('/');
    return { ...formState };
  };

  return (
    <FormContainer action={signOutAction}>
      <SubmitButton
        text='Sign Out'
        className='px-6 py-2 text-sm font-medium lg:text-base lg:tracking-tight w-full'
      />
    </FormContainer>
  );
}
export default SignOutButton;
