import { BoardTitleProvider } from '@/components/Mutation/Board/Title/BoardTitleContext';
import { MockedProvider } from '@apollo/client/testing/react';
import type { ApolloCache } from '@apollo/client';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import UpdateBoardTitle from '../../UpdateBoardTitle';
import { mockBoardId, mockBoardTitle } from './testMocks';

type RenderUpdateBoardTitleOptions = {
  boardId?: string;
  title?: string;
  cache?: ApolloCache;
};

export const renderUpdateBoardTitle = ({
  boardId = mockBoardId,
  title = mockBoardTitle,
  cache,
}: RenderUpdateBoardTitleOptions = {}) => {
  return render(
    <MockedProvider cache={cache}>
      <BoardTitleProvider>
        <UpdateBoardTitle boardId={boardId} title={title} />
      </BoardTitleProvider>
    </MockedProvider>,
  );
};

export const getAllElements = () => ({
  titleInput: page.getByRole('textbox', { name: /board title/i }),
  updateButton: (title = mockBoardTitle) =>
    page.getByRole('button', { name: new RegExp(`update ${title}`, 'i') }),
  saveButton: page.getByRole('button', { name: /save board title/i }),
  cancelButton: page.getByRole('button', {
    name: /cancel board title update/i,
  }),
});
