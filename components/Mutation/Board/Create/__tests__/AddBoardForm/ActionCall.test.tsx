import * as boardActions from '@/utils/actions/board';
import { CREATE_BOARD_FAIL } from '../testMocks';
import { getAllElements, renderAddBoardActionButton } from '../testUtils';

vi.mock('@/utils/actions/board');

beforeAll(() => {
  vi.mocked(boardActions.createBoard).mockResolvedValue(CREATE_BOARD_FAIL);
});

afterAll(() => {
  vi.resetAllMocks();
});

describe('AddBoardActionButton form submission', () => {
  it('calls createBoard with the trimmed board title', async () => {
    await renderAddBoardActionButton();

    const { createBoardButton, titleInput } = getAllElements();

    await createBoardButton.click();
    await titleInput.fill('  Career roadmap  ');
    await createBoardButton.click();

    expect(boardActions.createBoard).toHaveBeenCalledOnce();

    const formData = vi.mocked(boardActions.createBoard).mock.calls[0][0];

    expect(formData.get('title')).toBe('Career roadmap');
  });
});
