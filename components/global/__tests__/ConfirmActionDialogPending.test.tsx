import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import type { ActionFunction, FormState } from '@/types/app';
import ConfirmActionDialog from '../ConfirmActionDialog';

it('blocks confirmation dismissal and repeated submission until the action finishes', async () => {
  let finish!: (result: FormState) => void;
  const pending = new Promise<FormState>((resolve) => {
    finish = resolve;
  });
  const onConfirm = vi.fn<ActionFunction>().mockReturnValue(pending);
  const onClose = vi.fn();
  await render(
    <ConfirmActionDialog
      isOpen
      title='Delete selected cards'
      description='Confirm deletion'
      onClose={onClose}
      onConfirm={onConfirm}
    />,
  );

  const confirm = page.getByRole('button', { name: 'Continue' });
  const cancel = page.getByRole('button', { name: 'Cancel' });
  await confirm.click();

  try {
    await expect.element(confirm).toBeDisabled();
    await expect.element(cancel).toBeDisabled();
    await userEvent.keyboard('{Escape}');
    await userEvent.click(document.body, { position: { x: 0, y: 0 } });
    expect(onClose).not.toHaveBeenCalled();
    expect(onConfirm).toHaveBeenCalledOnce();
  } finally {
    finish({ error: 'Please retry' });
  }

  await expect.element(confirm).toBeEnabled();
  await expect.element(cancel).toBeEnabled();
  await cancel.click();
  expect(onClose).toHaveBeenCalledOnce();
});
