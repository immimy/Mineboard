import { successMock } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { renderBoard as renderBoardContainer } from '@/components/BoardPage/__tests__/testUtils';
import { MockLink } from '@apollo/client/testing';
import { page, userEvent } from 'vitest/browser';

export const renderBoard = (mocks: MockLink.MockedResponse[] = [successMock]) =>
  renderBoardContainer(mocks);

export const getAllElements = () => ({
  loading: page.getByLabelText('loading'),
  menuToggle: page.getByRole('button', {
    name: /action menu button/i,
  }),
  customListFieldsMenuItem: page.getByRole('menuitem', {
    name: /custom list fields/i,
  }),
  listFieldsFormIntro: page.getByText(/personalize the list item/i),
  closeListFieldsDialogButton: page.getByRole('button', {
    name: /close list fields dialog/i,
  }),
  closeUnsavedAlertButton: page.getByRole('button', { name: /^close$/i }),
  textTitleInput: page.getByPlaceholder('Text Title (optional)'),
  addListButton: page.getByRole('button', { name: /^add list$/i }),
  saveButton: page.getByRole('button', { name: /^save$/i }),
});

export const openListFieldsFromActionMenu = async () => {
  const { loading, menuToggle, customListFieldsMenuItem } = getAllElements();

  await expect.element(loading).not.toBeInTheDocument();
  await userEvent.click(menuToggle);
  await userEvent.click(customListFieldsMenuItem);
};

export const saveTextFieldTitle = async (title: string) => {
  const { saveButton, textTitleInput } = getAllElements();

  await textTitleInput.fill(title);
  await userEvent.click(saveButton);
};
