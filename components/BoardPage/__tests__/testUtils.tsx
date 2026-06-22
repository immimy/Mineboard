import { MockedProvider } from '@apollo/client/testing/react';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import BoardContainer from '../BoardContainer';
import { mockBoardId } from './singleBoardQuery.mock';
import { MockLink } from '@apollo/client/testing';

export const getAllElements = () => {
  const cards = page.getByRole('article');
  const lists = page
    .getByRole('listitem')
    .filter({ has: page.getByRole('list') });

  return {
    // Single board rendering
    loading: page.getByLabelText('loading'),
    error: page.getByText(/an error occurred/i),
    noData: page.getByText(/no data found/i),
    boardTitle: page.getByRole('heading', { level: 1, name: /test board/i }),
    card1: cards.nth(0).filter({ hasText: /test card/i }),
    list1: lists.nth(0),
    // Add card form submission
    addCardDialogButton: page.getByRole('button', { name: /add new card/i }),
    titleInput: page.getByLabelText(/title/i),
    thirdPalette: page.getByRole('radio', { name: /palette 3/i }),
    newCard: cards.nth(1).filter({ hasText: /career roadmap/i }),
    // Add list form submission
    addListDialogButton: page.getByRole('button', { name: /add list/i }),
    dateInput: page.getByLabelText(/deadline/i),
    textInput: page.getByLabelText(/note/i),
    saveButton: page.getByRole('button', { name: /save/i }),
    newList: lists.nth(1),
  };
};

export const renderSingleBoard = (mocks?: MockLink.MockedResponse[]) => {
  return render(
    <MockedProvider mocks={mocks}>
      <BoardContainer boardId={mockBoardId} />
    </MockedProvider>,
  );
};
