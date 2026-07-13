import { userEvent } from 'vitest/browser';
import { getAllElements, openListDialog, renderListDialog } from '../testUtils';

describe('ListDialog interaction', () => {
  it('date: updates value on type', async () => {
    renderListDialog();
    await openListDialog();

    const { dateList } = getAllElements();
    const dateInput = dateList.getByLabelText(/deadline/i);

    await userEvent.type(dateInput, '05012026');
    expect(dateInput).toHaveValue('2026-05-01');
  });
});
