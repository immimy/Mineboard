import { MockedProvider } from '@apollo/client/testing/react';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import BoardContainer from '@/components/BoardPage/BoardContainer';
import {
  mockBoardId,
  successMock,
} from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { CREATE_CARD_SUCCESS } from '@/components/Mutation/Card/Create/__tests__/testMocks';
import { ColorPalette } from '@/types/jsonbSchema';
import * as cardActions from '@/utils/actions/card';
import { getAllElements } from './testUtils';
import AppContextWrapper from '@/app/context';

// ───────────────────────────────────────────────────────────
// Mocks
// ───────────────────────────────────────────────────────────

vi.mock('@/utils/actions/card');
vi.mock('@/utils/actions/list');
vi.mock('@/components/Mutation/List/ListInputs/ImageInput');
vi.mock('@/components/Mutation/Board/Create/AddListFieldDialog', () => ({
  default: () => <div data-testid='mock-add-list-field-dialog' />,
}));

// ───────────────────────────────────────────────────────────
// Setup
// ───────────────────────────────────────────────────────────

beforeAll(() => {
  vi.mocked(cardActions.createCard).mockResolvedValue(CREATE_CARD_SUCCESS);
});
afterAll(() => {
  vi.resetAllMocks();
});

// ───────────────────────────────────────────────────────────
// Add card feature
// ───────────────────────────────────────────────────────────

describe('Add card feature', () => {
  it('renders new card after successful submission', async () => {
    await render(
      <MockedProvider mocks={[successMock]}>
        <AppContextWrapper>
          <BoardContainer boardId={mockBoardId} />
        </AppContextWrapper>
      </MockedProvider>,
    );

    const {
      loading,
      addCardDialogButton,
      titleInput,
      thirdPalette,
      saveButton,
      newCard,
    } = getAllElements();

    await expect.element(loading).not.toBeInTheDocument();
    await userEvent.click(addCardDialogButton);

    await titleInput.fill('Career roadmap');
    await thirdPalette.click();
    await saveButton.click();

    expect(cardActions.createCard).toHaveBeenCalledOnce();

    const formData = vi.mocked(cardActions.createCard).mock.calls[0][0];
    expect(formData.get('boardId')).toBe(mockBoardId);
    expect(formData.get('title')).toBe('Career roadmap');
    expect(formData.get('color')).toBe(String(ColorPalette.third));

    await expect.element(newCard).toBeVisible();
  });
});
