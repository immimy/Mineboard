import { MockedProvider } from '@apollo/client/testing/react';
import type { ComponentProps } from 'react';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import BoardsContainer from '../BoardsContainer';
import DashboardUserProvider from '../DashboardUserContext';
import { mockUserId } from './allBoardsQuery.mock';

type DashboardMocks = ComponentProps<typeof MockedProvider>['mocks'];

export function renderDashboard(mocks: DashboardMocks) {
  return render(
    <MockedProvider mocks={mocks}>
      <DashboardUserProvider userId={mockUserId}>
        <BoardsContainer />
      </DashboardUserProvider>
    </MockedProvider>,
  );
}

export const getAllElements = () => ({
  loading: page.getByLabelText('loading'),
  error: page.getByText(/an error occurred/i),
  noData: page.getByText(/no data found/i),
  boardItem1: page.getByText(/website redesign/i),
  boardItem2: page.getByText(/personal to-do/i),
  boardLinks: page.getByRole('link'),
});
