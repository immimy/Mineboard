import * as boardActions from '@/utils/actions/board';
import {
  getAllElements,
  openListFieldsFromActionMenu,
  renderBoard,
} from './testUtils';

vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

describe('Update list fields dialog opening', () => {
  it('opens the list fields dialog with the existing board field values', async () => {
    await renderBoard();

    const { listFieldsFormIntro, textTitleInput } = getAllElements();

    await openListFieldsFromActionMenu();

    await expect.element(listFieldsFormIntro).toBeVisible();
    await expect.element(textTitleInput).toHaveValue('Note');
    expect(boardActions.createListFields).not.toHaveBeenCalled();
    expect(boardActions.updateListFields).not.toHaveBeenCalled();
  });
});
