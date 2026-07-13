import * as boardActions from '@/utils/actions/board';
import { getAllElements, renderAddBoardTitle } from './testUtils';
import { CREATE_BOARD_FAIL } from './testMocks';

vi.mock('@/utils/actions/board');

beforeAll(() => {
  vi.mocked(boardActions.createBoard).mockResolvedValue(CREATE_BOARD_FAIL);
});

afterAll(() => {
  vi.resetAllMocks();
});

describe('AddBoardActionButton form submission', () => {
  it('calls createBoard with the trimmed board title', async () => {
    await renderAddBoardTitle();

    const { createBoardButton, titleInput } = getAllElements();

    await createBoardButton.click();
    await titleInput.fill('  Career roadmap  ');
    await createBoardButton.click();

    await vi.waitFor(() => {
      expect(boardActions.createBoard).toHaveBeenCalledOnce();
    });

    const formData = vi.mocked(boardActions.createBoard).mock.calls[0][0];

    expect(formData.get('title')).toBe('Career roadmap');
  });
});
