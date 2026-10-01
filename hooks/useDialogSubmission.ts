'use client';

import { useCallback, useOptimistic, useRef } from 'react';
import type { ActionFunction } from '@/types/app';

export default function useDialogSubmission() {
  // Form actions run in a transition. Optimistic state updates the controls
  // immediately and returns to false when that action finishes.
  const [isSubmitting, setIsSubmitting] = useOptimistic(false);
  const isSubmittingRef = useRef(false);

  const withSubmission = useCallback(
    (action: ActionFunction): ActionFunction =>
      async (state, formData) => {
        if (isSubmittingRef.current) return state;

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        try {
          return await action(state, formData);
        } finally {
          isSubmittingRef.current = false;
        }
      },
    [setIsSubmitting],
  );

  return { isSubmitting, isSubmittingRef, withSubmission };
}
