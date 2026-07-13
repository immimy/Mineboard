import { userEvent } from 'vitest/browser';
import { getAllElements, openListDialog, renderListDialog } from '../testUtils';

describe('ListDialog interaction', () => {
  it('tag: removes the last tag on Backspace when input is empty', async () => {
    renderListDialog();
    await openListDialog();

    const { tagList } = getAllElements();
    const tagInput = tagList.getByPlaceholder(/add tag/i);

    await tagInput.fill('todo');
    await userEvent.keyboard('{Enter}');
    expect(tagList.getByText('todo')).toBeVisible();

    // Input is now empty, so Backspace removes the last tag.
    await userEvent.keyboard('{Backspace}');
    expect(tagInput.getByText('todo').query()).toBe(null);
  });
});
