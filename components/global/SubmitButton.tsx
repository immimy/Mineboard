'use client';

import { useFormStatus } from 'react-dom';
import { Loading } from './LoadingContainer';
import { Button } from '@headlessui/react';
import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';

type SubmitButtonProps = {
  className?: string;
  disabled?: boolean;
  formId?: string;
};

function SubmitButton({
  children,
  className,
  disabled,
  formId,
}: SubmitButtonProps & PropsWithChildren) {
  const { pending } = useFormStatus();
  return (
    <Button
      form={formId}
      type='submit'
      disabled={disabled || pending}
      className={clsx(
        'capitalize tracking-tight font-semibold hover:cursor-pointer w-full',
        className,
      )}
    >
      {pending ? <Loading /> : children || 'submit'}
    </Button>
  );
}
export default SubmitButton;
