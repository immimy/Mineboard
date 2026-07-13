import { getAllElements, openListDialog, renderListDialog } from '../testUtils';

describe('ListDialog interaction', () => {
  it('number: updates value on type', async () => {
    renderListDialog();
    await openListDialog();

    const { numberList } = getAllElements();
    const numberInput = numberList.getByLabelText(/estimate/i);

    await numberInput.fill('8');
    expect(numberInput).toHaveValue(8);
  });
});
