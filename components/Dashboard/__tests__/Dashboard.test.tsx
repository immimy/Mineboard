import { render } from 'vitest-browser-react';
import BoardsContainer from '../BoardsContainer';
import { page } from 'vitest/browser';
import { MockedProvider } from '@apollo/client/testing/react';
import {
  graphqlErrorMock,
  mockUserId,
  networkErrorMock,
  noDataMock,
  successMock,
} from './allBoardsQuery.mock';

const getAllElements = () => {
  return {
    loading: page.getByLabelText('loading'),
    error: page.getByText(/an error occurred/i),
    noData: page.getByText(/no data found/i),
    boardItem1: page.getByText(/website redesign/i),
    boardItem2: page.getByText(/personal to-do/i),
    boardLinks: page.getByRole('link'),
  };
};

// ---------------------------------------------------------------------------
// Dashboard Page
// ---------------------------------------------------------------------------

describe('Dashboard page is rendered correctly', () => {
  it('render an error when network error occurs', async () => {
    await render(
      <MockedProvider mocks={[networkErrorMock]}>
        <BoardsContainer userId={mockUserId} />
      </MockedProvider>,
    );
    const { loading, error } = getAllElements();
    // Wait for loading to resolve,
    await expect.element(loading).not.toBeInTheDocument();
    // then confirm the error UI is shown.
    await expect.element(error).toBeInTheDocument();
  });

  it('render an error when GraphQL error occurs', async () => {
    await render(
      <MockedProvider mocks={[graphqlErrorMock]}>
        <BoardsContainer userId={mockUserId} />
      </MockedProvider>,
    );
    const { loading, error } = getAllElements();
    await expect.element(loading).not.toBeInTheDocument();
    await expect.element(error).toBeInTheDocument();
  });

  it('render no data found when returned data is empty', async () => {
    await render(
      <MockedProvider mocks={[noDataMock]}>
        <BoardsContainer userId={mockUserId} />
      </MockedProvider>,
    );
    const { loading, noData } = getAllElements();
    await expect.element(loading).not.toBeInTheDocument();
    await expect.element(noData).toBeInTheDocument();
  });

  it('render board items correctly', async () => {
    await render(
      <MockedProvider mocks={[successMock]}>
        <BoardsContainer userId={mockUserId} />
      </MockedProvider>,
    );
    const { loading, boardItem1, boardItem2 } = getAllElements();
    // 1. Loading spinner should appear immediately.
    await expect.element(loading).toBeInTheDocument();
    // 2. Wait for the spinner to leave
    await expect.element(loading).not.toBeInTheDocument();
    // 3. Board items are now in the DOM.
    await expect.element(boardItem1).toBeInTheDocument();
    await expect.element(boardItem2).toBeInTheDocument();
  });

  it('links to the correct board page', async () => {
    await render(
      <MockedProvider mocks={[successMock]}>
        <BoardsContainer userId={mockUserId} />
      </MockedProvider>,
    );
    const { loading, boardLinks } = getAllElements();
    // Wait for loading to resolve,
    await expect.element(loading).not.toBeInTheDocument();
    // Individual board link locator
    const link1 = boardLinks.filter({ hasText: /website redesign/i });
    const link2 = boardLinks.filter({ hasText: /personal to-do/i });
    // Board links have correct href attributes
    expect(link1).toHaveAttribute('href', '/dashboard/boardId1');
    expect(link2).toHaveAttribute('href', '/dashboard/boardId2');
  });
});
