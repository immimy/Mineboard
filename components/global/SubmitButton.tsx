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
  ariaLabel?: string;
  text?: string;
};

function SubmitButton({
  children,
  className,
  disabled,
  formId,
  ariaLabel,
  text,
}: SubmitButtonProps & PropsWithChildren) {
  const { pending } = useFormStatus();
  return (
    <Button
      form={formId}
      type='submit'
      disabled={disabled || pending}
      aria-label={ariaLabel}
      className={clsx(
        'capitalize tracking-tight font-semibold hover:cursor-pointer w-full',
        className,
      )}
    >
      {pending ? <Loading size='size-4' /> : (children ?? text ?? 'submit')}
    </Button>
  );
}
export default SubmitButton;
