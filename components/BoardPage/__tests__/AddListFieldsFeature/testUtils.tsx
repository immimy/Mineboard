import { renderBoard as renderBoardContainer } from '../testUtils';
import { MockLink } from '@apollo/client/testing';
import { page, userEvent } from 'vitest/browser';
import { emptyBoardMock } from './testMocks';

export const renderBoard = (
  mocks: MockLink.MockedResponse[] = [emptyBoardMock],
) => renderBoardContainer(mocks);

export const getAllElements = () => ({
  loading: page.getByLabelText('loading'),
  noListFieldsHeading: page.getByRole('heading', {
    name: /no list fields yet/i,
  }),
  noCardsHeading: page.getByRole('heading', { name: /no cards yet/i }),
  emptyStateCreateButton: page.getByRole('button', { name: /^create one$/i }),
  addCardButton: page.getByRole('button', { name: /add new card/i }),
  addTextFieldButton: page.getByRole('button', { name: /^text$/i }),
  textTitleInput: page.getByPlaceholder('Text Title (optional)'),
  saveButton: page.getByRole('button', { name: /^save$/i }),
  createCardHeading: page.getByRole('heading', {
    level: 2,
    name: /create card/i,
  }),
  listFieldsFormIntro: page.getByText(/personalize the list item/i),
});

export const openListFieldsFromEmptyState = async () => {
  const { loading, noListFieldsHeading, emptyStateCreateButton } =
    getAllElements();

  await expect.element(loading).not.toBeInTheDocument();
  await expect.element(noListFieldsHeading).toBeVisible();
  await userEvent.click(emptyStateCreateButton);
};

export const saveTextListField = async (title = 'Note') => {
  const { addTextFieldButton, textTitleInput, saveButton } = getAllElements();

  await userEvent.click(addTextFieldButton);
  await textTitleInput.fill(title);
  await userEvent.click(saveButton);
};
