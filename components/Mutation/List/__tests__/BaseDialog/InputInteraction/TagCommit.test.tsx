import { userEvent } from 'vitest/browser';
import { getAllElements, openListDialog, renderListDialog } from '../testUtils';

describe('ListDialog interaction', () => {
  it('tag: commits a tag on Enter and clears the input', async () => {
    renderListDialog();
    await openListDialog();

    const { tagList } = getAllElements();
    const tagInput = tagList.getByPlaceholder(/add tag/i);

    await tagInput.fill('groceries');
    await userEvent.keyboard('{Enter}');

    expect(tagList.getByText('groceries')).toBeVisible();
    expect(tagInput).toHaveValue('');
  });

  it('tag: commits a tag on Space', async () => {
    renderListDialog();
    await openListDialog();

    const { tagList } = getAllElements();
    const tagInput = tagList.getByPlaceholder(/add tag/i);

    await tagInput.fill('work');
    await userEvent.keyboard('{Space}');

    expect(tagList.getByText('work')).toBeVisible();
  });
});
