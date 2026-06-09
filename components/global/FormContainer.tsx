'use client';

import { ActionFunction, FormState } from '@/types/app';
import { ChangeEventHandler, useActionState, useEffect } from 'react';
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
      {children}
    </form>
  );
}
export default FormContainer;
