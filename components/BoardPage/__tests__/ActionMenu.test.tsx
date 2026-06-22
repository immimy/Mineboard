import AppContextWrapper from '@/app/context';
import { MockedProvider } from '@apollo/client/testing/react';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { toast } from 'react-toastify';
import ActionMenuContainer from '../ActionMenuContainer';
import BoardContextWrapper from '../BoardContext';
import AddCardDialog from '@/components/Mutation/Card/Create/AddCardDialog';
import AddListFieldDialog from '@/components/Mutation/Board/Create/AddListFieldDialog';
import type { ListFieldsCollectionFragment } from '@/gql/__generated__/graphql';
import { mockBoardId, mockListFields } from './singleBoardQuery.mock';

vi.mock('@/utils/actions/card');
vi.mock('@/utils/actions/board');

// Helpers

const listFieldsWithValues = mockListFields as {
  ' $fragmentRefs'?: {
    ListFieldsCollectionFragment: ListFieldsCollectionFragment;
  };
};

type ListFieldsQuery = typeof listFieldsWithValues | null;

const renderActionMenu = (
  queryListFields: ListFieldsQuery = listFieldsWithValues,
) => {
  return render(
    <MockedProvider>
      <AppContextWrapper>
        <BoardContextWrapper
          boardId={mockBoardId}
          queryListFields={queryListFields}
        >
          <ActionMenuContainer />
          <AddListFieldDialog />
          <AddCardDialog />
        </BoardContextWrapper>
      </AppContextWrapper>
    </MockedProvider>,
  );
};

const getAllElements = () => {
  return {
    menuToggle: page.getByRole('button').nth(1),
    addNewCardButton: page.getByRole('button', { name: /add new card/i }),
    editBoardTitleButton: page.getByRole('button', {
      name: /edit board title/i,
    }),
    customListFieldsButton: page.getByRole('button', {
      name: /custom list fields/i,
    }),
    createCardHeader: page.getByRole('heading', {
      level: 2,
      name: /create card/i,
    }),
    listFieldsDescription: page.getByText(/personalize the list item/i),
  };
};

const openActionMenu = async () => {
  const { menuToggle } = getAllElements();
  await userEvent.click(menuToggle);
};

// Tests

describe('ActionMenu', () => {
  it('renders "Add new card" as the default active action', async () => {
    renderActionMenu();
    const { addNewCardButton } = getAllElements();

    await expect.element(addNewCardButton).toBeInTheDocument();
  });

  it('switches to "Edit board title" and runs the selected action', async () => {
    renderActionMenu();
    const { editBoardTitleButton } = getAllElements();

    await openActionMenu();
    // Select "Edit board title" as active action
    await userEvent.click(editBoardTitleButton);
    // Trigger the action button
    await userEvent.click(editBoardTitleButton);

    expect(toast.info).toHaveBeenCalledWith('Edit board title action selected');
  });

  it('switches to "Custom list fields" and opens the list fields dialog', async () => {
    renderActionMenu();
    const { customListFieldsButton, listFieldsDescription } = getAllElements();

    await openActionMenu();
    // Select "Custom list fields" as active action
    await userEvent.click(customListFieldsButton);
    // Trigger the action button
    await userEvent.click(customListFieldsButton);

    await expect.element(listFieldsDescription).toBeInTheDocument();
  });

  it('opens the Add Card dialog when "Add new card" is selected', async () => {
    renderActionMenu();
    const { addNewCardButton, createCardHeader } = getAllElements();

    await userEvent.click(addNewCardButton);

    await expect.element(createCardHeader).toBeInTheDocument();
  });

  it('disables the Add Card action until list fields exist', async () => {
    renderActionMenu(null);
    const { addNewCardButton, createCardHeader } = getAllElements();

    await expect.element(addNewCardButton).toBeDisabled();
    await addNewCardButton.click({ force: true });
    await expect.element(createCardHeader).not.toBeInTheDocument();
  });
});
