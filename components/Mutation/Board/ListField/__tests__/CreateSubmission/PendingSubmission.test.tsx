import { page, userEvent } from 'vitest/browser';
import * as boardActions from '@/utils/actions/board';
import { toast } from 'react-toastify';
import { getAllElements, renderListFieldDialog } from '../testUtils';
import { CREATE_LIST_FIELDS_FAIL } from './testMocks';

vi.mock('@/utils/actions/board');

it('blocks dismissal and field editing while saving, then allows retry after failure', async () => {
  let finish!: (result: typeof CREATE_LIST_FIELDS_FAIL) => void;
  vi.mocked(boardActions.createListFields).mockReturnValue(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  await renderListFieldDialog();
  const {
    openDialogButton,
    closeDialogButton,
    dialog,
    addFieldButton,
    titleInput,
    saveButton,
    resetButton,
    fieldActionButton,
  } = getAllElements();
  await openDialogButton.click();
  await addFieldButton.text.click();
  await titleInput.text.fill('Keep this field');
  await saveButton.click();

  try {
    await expect.element(closeDialogButton).toBeDisabled();
    await expect.element(resetButton).toBeDisabled();
    await expect.element(addFieldButton.number).toBeDisabled();
    await expect.element(titleInput.text).toBeDisabled();
    await expect.element(fieldActionButton.text.changeType).toBeDisabled();
    await expect.element(fieldActionButton.text.remove).toBeDisabled();
    await expect
      .element(page.getByRole('button', { name: /drag text field/i }))
      .toBeDisabled();
    await userEvent.keyboard('{Escape}');
    await userEvent.click(document.body, { position: { x: 0, y: 0 } });
    await expect.element(dialog).toBeVisible();
    await expect
      .element(page.getByRole('dialog', { name: /discard changes/i }))
      .not.toBeInTheDocument();
    expect(boardActions.createListFields).toHaveBeenCalledOnce();
  } finally {
    finish(CREATE_LIST_FIELDS_FAIL);
  }

  await expect.element(saveButton).toBeEnabled();
  await expect.element(closeDialogButton).toBeEnabled();
  await expect.element(resetButton).toBeEnabled();
  await expect.element(addFieldButton.number).toBeEnabled();
  await expect.element(titleInput.text).toHaveValue('Keep this field');
  expect(toast.error).toHaveBeenCalledWith(CREATE_LIST_FIELDS_FAIL.error);
  await closeDialogButton.click();
  await expect
    .element(page.getByRole('dialog', { name: /discard changes/i }))
    .toBeVisible();
});
