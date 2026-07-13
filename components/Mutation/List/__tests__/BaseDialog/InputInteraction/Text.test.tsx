import { getAllElements, openListDialog, renderListDialog } from '../testUtils';

describe('ListDialog interaction', () => {
  it('text: updates textarea value on type', async () => {
    renderListDialog();
    await openListDialog();

    const { textList } = getAllElements();
    const textInput = textList.getByLabelText(/note/i);

    await textInput.fill('My note');
    expect(textInput).toHaveValue('My note');
  });
});
