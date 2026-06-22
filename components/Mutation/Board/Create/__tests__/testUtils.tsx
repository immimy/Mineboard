import { MockedProvider } from '@apollo/client/testing/react';
import { ApolloCache } from '@apollo/client';
import { useState, type ReactNode } from 'react';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import AddBoardActionButton, { PendingBoard } from '../AddBoardActionButton';
import { mockUserId } from './testMocks';

type RenderAddBoardActionButtonOptions = {
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

function AddBoardActionButtonHarness({
  userId = mockUserId,
  isDisabled = false,
}: Omit<RenderAddBoardActionButtonOptions, 'cache'>) {
  const [pendingBoards, setPendingBoards] = useState<PendingBoard[]>([]);

  return (
    <PendingBoardsHarness pendingBoards={pendingBoards}>
      <AddBoardActionButton
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
  pendingBoards: page.getByRole('list', { name: /pending boards/i }),
  pendingBoard: (title: string) => page.getByRole('listitem').filter({ hasText: title }),
});

export const renderAddBoardActionButton = ({
  cache,
  userId = mockUserId,
  isDisabled = false,
}: RenderAddBoardActionButtonOptions = {}) => {
  return render(
    <MockedProvider cache={cache}>
      <AddBoardActionButtonHarness
        userId={userId}
        isDisabled={isDisabled}
      />
    </MockedProvider>,
  );
};
