import { GoogleIcon } from '@/icons/icons';
import { signInWithGoogle } from '@/utils/database/auth';
import FormContainer from '../global/FormContainer';
import SubmitButton from '../global/SubmitButton';

function SignInButton() {
  return (
    <FormContainer action={signInWithGoogle}>
      <SubmitButton className='px-6 py-2 flex items-center gap-1.5 text-sm font-medium lg:gap-3 lg:text-base lg:tracking-tight w-full'>
        <GoogleIcon /> Sign in with Google
      </SubmitButton>
    </FormContainer>
  );
}
export default SignInButton;
