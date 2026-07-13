import AppContextProvider, {
  useAppContext,
} from '@/components/global/AppContext';
import { BoardTitleProvider } from '@/components/Mutation/Board/Title/BoardTitleContext';
import DashboardSidebar from '@/components/Sidebar/DashboardSidebar';
import {
  AllBoardsDocument,
  BoardTitleDocument,
} from '@/gql/__generated__/graphql';
import * as boardActions from '@/utils/actions/board';
import { MockedProvider } from '@apollo/client/testing/react';
import { useParams, usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import BoardBadge from '../BoardBadge';

vi.mock('@/utils/actions/board');

const mockUserId = 'userId1';
const mockBoardId = 'boardId1';
const oldTitle = 'Website redesign';
const newTitle = 'Career roadmap';

const boardTitleMock = {
  request: {
    query: BoardTitleDocument,
    variables: { boardId: mockBoardId },
  },
  result: {
    data: {
      __typename: 'Query',
      boardsCollection: {
        __typename: 'boardsConnection',
        edges: [
          {
            __typename: 'boardsEdge',
            node: {
              __typename: 'boards',
              id: mockBoardId,
              title: oldTitle,
            },
          },
        ],
      },
    },
  },
};

const allBoardsMock = {
  request: {
    query: AllBoardsDocument,
    variables: { userId: mockUserId },
  },
  result: {
    data: {
      __typename: 'Query',
      boardsCollection: {
        __typename: 'boardsConnection',
        edges: [
          {
            __typename: 'boardsEdge',
            node: {
              __typename: 'boards',
              id: mockBoardId,
              title: oldTitle,
            },
          },
        ],
      },
    },
  },
};

function OpenSidebarButton() {
  const { openSidebar } = useAppContext();

  return (
    <button type='button' onClick={openSidebar}>
      Open sidebar
    </button>
  );
}

function PreventNavigationBoundary({ children }: PropsWithChildren) {
  return (
    <div
      onClickCapture={(event) => {
        if (!(event.target instanceof Element)) return;
        if (!event.target.closest('a[href]')) return;

        event.preventDefault();
      }}
    >
      {children}
    </div>
  );
}

const renderUpdateBoardTitleFeature = () => {
  return render(
    <MockedProvider mocks={[boardTitleMock, allBoardsMock]}>
      <AppContextProvider>
        <BoardTitleProvider>
          <PreventNavigationBoundary>
            <OpenSidebarButton />
            <BoardBadge />
            <DashboardSidebar userId={mockUserId} />
          </PreventNavigationBoundary>
        </BoardTitleProvider>
      </AppContextProvider>
    </MockedProvider>,
  );
};

beforeEach(() => {
  vi.mocked(useParams).mockReturnValue({ id: mockBoardId });
  vi.mocked(usePathname).mockReturnValue(`/dashboard/${mockBoardId}`);
  vi.mocked(boardActions.updateBoardTitle).mockResolvedValue({
    data: {
      __typename: 'boards',
      id: mockBoardId,
      title: newTitle,
    },
    error: null,
  });
});

describe('UpdateBoardTitle feature', () => {
  it('updates the board title shown in the navbar and sidebar', async () => {
    renderUpdateBoardTitleFeature();

    const titleInput = page.getByRole('textbox', { name: /board title/i });
    const openSidebarButton = page.getByRole('button', {
      name: /open sidebar/i,
    });
    const sidebar = page.getByLabelText(/board navigation/i);

    await expect.element(titleInput).toHaveValue(oldTitle);

    await openSidebarButton.click();
    await expect.element(sidebar).toBeVisible();
    await expect
      .element(page.getByRole('link', { name: oldTitle }))
      .toBeVisible();

    await userEvent.click(
      page.getByRole('button', { name: new RegExp(`update ${oldTitle}`, 'i') }),
    );
    await titleInput.fill(`  ${newTitle}  `);
    await userEvent.click(
      page.getByRole('button', { name: /save board title/i }),
    );

    await expect.element(titleInput).toHaveValue(newTitle);
    await expect.element(titleInput).toBeDisabled();

    const updatedSidebarLink = page.getByRole('link', { name: newTitle });
    await expect.element(updatedSidebarLink).toBeVisible();
    expect(updatedSidebarLink).toHaveAttribute(
      'href',
      `/dashboard/${mockBoardId}`,
    );
  });
});
