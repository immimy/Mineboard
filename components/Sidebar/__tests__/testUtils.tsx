import AppContextWrapper, { useAppContext } from '@/app/context';
import { MockedProvider } from '@apollo/client/testing/react';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import DashboardSidebar from '../DashboardSidebar';
import { mockUserId } from './testMocks';
import type { ComponentProps, PropsWithChildren } from 'react';

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

export const renderDashboardSidebar = (
  mocks: ComponentProps<typeof MockedProvider>['mocks'],
) => {
  return render(
    <MockedProvider mocks={mocks}>
      <AppContextWrapper>
        <PreventNavigationBoundary>
          <OpenSidebarButton />
          <DashboardSidebar userId={mockUserId} />
        </PreventNavigationBoundary>
      </AppContextWrapper>
    </MockedProvider>,
  );
};

export const getAllElements = () => ({
  openSidebarButton: page.getByRole('button', { name: /open sidebar/i }),
  sidebar: page.getByLabelText(/board navigation/i),
  loading: page.getByLabelText('loading'),
  error: page.getByText(/an error occurred/i),
  noBoards: page.getByText(/no boards yet/i),
  createBoardButton: page.getByRole('button', { name: /^create board$/i }),
  titleInput: page.getByLabelText(/board title/i),
  existingBoardLink: page.getByRole('link', { name: /website redesign/i }),
  secondBoardLink: page.getByRole('link', { name: /personal to-do/i }),
  createdBoardLink: page.getByRole('link', { name: /career roadmap/i }),
});
