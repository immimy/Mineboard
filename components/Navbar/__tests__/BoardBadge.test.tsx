import { MockedProvider } from '@apollo/client/testing/react';
import type { MockLink } from '@apollo/client/testing';
import { BoardTitleDocument } from '@/gql/__generated__/graphql';
import { GraphQLError } from 'graphql/error';
import { useParams, usePathname } from 'next/navigation';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import BoardBadge from '../BoardBadge';
import { BoardTitleProvider } from '@/components/Mutation/Board/Title/BoardTitleContext';

vi.mock('@/utils/actions/board');

const mockBoardId = 'boardId1';

const boardTitleMock: MockLink.MockedResponse = {
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
              title: 'Test Board',
            },
          },
        ],
      },
    },
  },
};

const boardTitleErrorMock: MockLink.MockedResponse = {
  request: {
    query: BoardTitleDocument,
    variables: { boardId: mockBoardId },
  },
  result: {
    errors: [new GraphQLError('Board title failed')],
  },
};

const renderBoardBadge = (
  mocks: MockLink.MockedResponse[] = [boardTitleMock],
) => {
  return render(
    <MockedProvider mocks={mocks}>
      <BoardTitleProvider>
        <BoardBadge />
      </BoardTitleProvider>
    </MockedProvider>,
  );
};

beforeEach(() => {
  vi.mocked(useParams).mockReturnValue({ id: mockBoardId });
});

describe('BoardBadge', () => {
  it('renders Mineboard as a homepage link on the landing page', async () => {
    vi.mocked(usePathname).mockReturnValue('/');

    renderBoardBadge();

    await expect
      .element(page.getByRole('link', { name: /mineboard/i }))
      .toHaveAttribute('href', '/');
  });

  it('renders Mineboard as a homepage link on the dashboard page', async () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard');

    renderBoardBadge();

    await expect
      .element(page.getByRole('link', { name: /mineboard/i }))
      .toHaveAttribute('href', '/');
  });

  // Other routes, unless landing page, should render board title.
  // Since currently there is only boards page, this will suffice for the time being.
  it('renders the board title on board routes', async () => {
    vi.mocked(usePathname).mockReturnValue(`/dashboard/${mockBoardId}`);

    renderBoardBadge();

    const titleInput = page.getByRole('textbox', { name: /board title/i });

    await expect.element(titleInput).toHaveValue('Test Board');
    await expect.element(titleInput).toBeDisabled();
  });

  it('renders an error when the board title query fails', async () => {
    vi.mocked(usePathname).mockReturnValue(`/dashboard/${mockBoardId}`);

    renderBoardBadge([boardTitleErrorMock]);

    await expect
      .element(page.getByText(/an error occurred/i))
      .toBeInTheDocument();
  });
});
