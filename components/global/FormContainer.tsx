'use client';

import { ActionFunction, FormState } from '@/types/app';
import { Fieldset } from '@headlessui/react';
import {
  ChangeEventHandler,
  PropsWithChildren,
  useActionState,
  useEffect,
} from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'react-toastify';

const initialState: FormState = {
  error: null,
};

type FormContainerProps = {
  children: React.ReactNode;
  action: ActionFunction;
  onChange?: ChangeEventHandler;
  id?: string;
  className?: string;
};

function FormContainer({
  children,
  action,
  onChange,
  id,
  className,
}: FormContainerProps) {
  const [state, formAction] = useActionState(action, initialState);
  useEffect(() => {
    if (!state.error) return;
    toast.error(state.error);
  }, [state]);
  return (
    <form id={id} action={formAction} onChange={onChange} className={className}>
      <PendingFieldset>{children}</PendingFieldset>
    </form>
  );
}
export default FormContainer;

function PendingFieldset({ children }: PropsWithChildren) {
  const { pending } = useFormStatus();
  return <Fieldset disabled={pending}>{children}</Fieldset>;
}
