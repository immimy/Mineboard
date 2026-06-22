import * as boardActions from '@/utils/actions/board';
import {
  createBoardSuccess,
  createdBoardId,
  existingBoardId,
  graphqlErrorMock,
  loadingMock,
  noBoardsMock,
  secondBoardId,
  successMock,
} from './testMocks';
import { getAllElements, renderDashboardSidebar } from './testUtils';

vi.mock('@/utils/actions/board');

describe('DashboardSidebar', () => {
  it('opens board navigation, links to boards, and closes after navigation', async () => {
    await renderDashboardSidebar([successMock]);

    const {
      openSidebarButton,
      sidebar,
      loading,
      existingBoardLink,
      secondBoardLink,
    } = getAllElements();

    await expect.element(sidebar).not.toBeVisible();

    await openSidebarButton.click();
    await expect.element(sidebar).toBeVisible();
    await expect.element(loading).not.toBeInTheDocument();

    expect(existingBoardLink).toHaveAttribute(
      'href',
      `/dashboard/${existingBoardId}`,
    );
    expect(secondBoardLink).toHaveAttribute(
      'href',
      `/dashboard/${secondBoardId}`,
    );

    await existingBoardLink.click();

    await expect.element(sidebar).not.toBeVisible();
  });

  it('disables board creation while board navigation is loading', async () => {
    await renderDashboardSidebar([loadingMock]);

    const { openSidebarButton, loading, createBoardButton } = getAllElements();

    await openSidebarButton.click();

    await expect.element(loading).toBeInTheDocument();
    expect(createBoardButton).toBeDisabled();
  });

  it('renders an empty state when the user has no boards', async () => {
    await renderDashboardSidebar([noBoardsMock]);

    const { openSidebarButton, loading, noBoards, createBoardButton } =
      getAllElements();

    await openSidebarButton.click();
    await expect.element(loading).not.toBeInTheDocument();

    await expect.element(noBoards).toBeVisible();
    expect(createBoardButton).toBeEnabled();
  });

  it('renders an error state when board navigation fails to load', async () => {
    await renderDashboardSidebar([graphqlErrorMock]);

    const { openSidebarButton, loading, error } = getAllElements();

    await openSidebarButton.click();
    await expect.element(loading).not.toBeInTheDocument();

    await expect.element(error).toBeVisible();
  });

  it('shows the new board title as a navigation link after successful creation', async () => {
    vi.mocked(boardActions.createBoard).mockResolvedValue(createBoardSuccess);

    await renderDashboardSidebar([successMock]);

    const {
      openSidebarButton,
      loading,
      createBoardButton,
      titleInput,
      createdBoardLink,
    } = getAllElements();

    await openSidebarButton.click();
    await expect.element(loading).not.toBeInTheDocument();

    await createBoardButton.click();
    await titleInput.fill('Career roadmap');
    await createBoardButton.click();

    await expect.element(createdBoardLink).toBeVisible();
    expect(createdBoardLink).toHaveAttribute(
      'href',
      `/dashboard/${createdBoardId}`,
    );
  });
});
