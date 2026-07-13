import { MockedProvider } from '@apollo/client/testing/react';
import { ApolloCache } from '@apollo/client';
import { useState, type ReactNode } from 'react';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { mockUserId } from './testMocks';
import AddBoardTitle, { PendingBoard } from '../../AddBoardTitle';

type RenderAddBoardTitleOptions = {
  cache?: ApolloCache;
  userId?: string;
  isDisabled?: boolean;
};

function PendingBoardsHarness({
  children,
  pendingBoards,
}: {
  children: ReactNode;
  pendingBoards: PendingBoard[];
}) {
  return (
    <div>
      <ul aria-label='Pending boards'>
        {pendingBoards.map((board) => (
          <li key={board.id}>{board.title}</li>
        ))}
      </ul>
      {children}
    </div>
  );
}

function AddBoardTitleHarness({
  userId = mockUserId,
  isDisabled = false,
}: Omit<RenderAddBoardTitleOptions, 'cache'>) {
  const [pendingBoards, setPendingBoards] = useState<PendingBoard[]>([]);

  return (
    <PendingBoardsHarness pendingBoards={pendingBoards}>
      <AddBoardTitle
        userId={userId}
        isDisabled={isDisabled}
        setPendingBoards={setPendingBoards}
      />
    </PendingBoardsHarness>
  );
}

export const getAllElements = () => ({
  createBoardButton: page.getByRole('button', { name: /^create board$/i }),
  cancelButton: page.getByRole('button', { name: /cancel add board/i }),
  titleInput: page.getByLabelText(/board title/i),
  requiredError: page.getByText(/this is required/i),
  maxLengthError: page.getByText(/max 30 characters/i),
  pendingBoard: (title: string) =>
    page.getByRole('listitem').filter({ hasText: title }),
});

export const renderAddBoardTitle = ({
  cache,
  userId = mockUserId,
  isDisabled = false,
}: RenderAddBoardTitleOptions = {}) => {
  return render(
    <MockedProvider cache={cache}>
      <AddBoardTitleHarness userId={userId} isDisabled={isDisabled} />
    </MockedProvider>,
  );
};
