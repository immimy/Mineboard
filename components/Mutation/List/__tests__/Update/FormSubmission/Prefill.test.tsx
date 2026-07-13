import {
  getAllElements,
  openUpdateListDialog,
  renderUpdateListDialog,
} from '../testUtils';
import { secondUpdateListInput } from '../testMocks';

vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

describe('UpdateListDialog interaction', () => {
  it('prefills existing list values', async () => {
    renderUpdateListDialog();

    const { header, textInput, numberInput } = getAllElements();

    await openUpdateListDialog();

    await expect.element(header).toBeVisible();
    await expect.element(textInput).toHaveValue('Start with Atomic Habits');
    await expect.element(numberInput).toHaveValue(8);
  });

  it('prefills the list passed to the open button', async () => {
    renderUpdateListDialog({ initialInput: secondUpdateListInput });

    const { textInput } = getAllElements();

    await openUpdateListDialog();

    await expect.element(textInput).toHaveValue('Second list note');
  });
});
