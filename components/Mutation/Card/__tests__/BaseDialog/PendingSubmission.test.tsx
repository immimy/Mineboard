import { useState } from 'react';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import type { ActionFunction, FormState } from '@/types/app';
import CardDialog from '../../CardDialog';
import { ColorPalette } from '@/types/jsonbSchema';
import type { CardFormState } from '../../CardDialog';

function PendingDialog({
  action,
  deleteAction,
  onClose,
}: {
  action: ActionFunction;
  deleteAction: ActionFunction;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CardFormState>({
    title: 'Keep this title',
    color: ColorPalette.first,
  });
  return (
    <CardDialog
      formId='pending_card'
      title='Pending card'
      description='Submission guard test'
      open
      form={form}
      onFormChange={setForm}
      onClose={onClose}
      action={action}
      deleteAction={deleteAction}
    />
  );
}

it.each(['save', 'delete'] as const)(
  'blocks dismissal and both actions during %s, then unlocks on failure',
  async (operation) => {
    let finish!: (result: FormState) => void;
    const pending = new Promise<FormState>((resolve) => {
      finish = resolve;
    });
    const action = vi.fn<ActionFunction>().mockResolvedValue({ error: null });
    const deleteAction = vi
      .fn<ActionFunction>()
      .mockResolvedValue({ error: null });
    const activeAction = operation === 'save' ? action : deleteAction;
    activeAction.mockReturnValue(pending);
    const onClose = vi.fn();
    await render(
      <PendingDialog
        action={action}
        deleteAction={deleteAction}
        onClose={onClose}
      />,
    );

    const save = page.getByRole('button', { name: /^save$/i });
    const remove = page.getByRole('button', { name: /^delete card$/i });
    const cancel = page.getByRole('button', { name: /^cancel$/i });
    const input = page.getByLabelText(/title/i);
    await (operation === 'save' ? save : remove).click();

    try {
      await expect.element(input).toBeDisabled();
      await expect.element(cancel).toBeDisabled();
      for (const button of document.querySelectorAll('button[type="submit"]')) {
        expect(button).toBeDisabled();
      }
      await expect.element(operation === 'save' ? remove : save).toBeDisabled();
      await userEvent.keyboard('{Escape}');
      await userEvent.click(document.body, { position: { x: 0, y: 0 } });
      expect(onClose).not.toHaveBeenCalled();
      expect(activeAction).toHaveBeenCalledOnce();
      expect(operation === 'save' ? deleteAction : action).not.toHaveBeenCalled();
    } finally {
      finish({ error: 'Please retry' });
    }

    await expect.element(save).toBeEnabled();
    await expect.element(remove).toBeEnabled();
    await expect.element(input).toBeEnabled();
    await cancel.click();
    expect(onClose).toHaveBeenCalledOnce();
  },
);
