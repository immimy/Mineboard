import { getAllElements, openListDialog, renderListDialog } from '../testUtils';

describe('ListDialog interaction', () => {
  it('checkbox: toggles the checked state on click', async () => {
    renderListDialog();
    await openListDialog();

    const { checkboxList } = getAllElements();
    const checkedInput = checkboxList.getByRole('checkbox');

    expect(checkedInput).not.toBeChecked();
    await checkedInput.click();
    expect(checkedInput).toBeChecked();
  });

  it('checkbox: updates the title text on type', async () => {
    renderListDialog();
    await openListDialog();

    const { checkboxList } = getAllElements();

    const titleInput = checkboxList.getByPlaceholder('checklist');

    await titleInput.fill('Morning run');
    expect(titleInput).toHaveValue('Morning run');
  });
});
