import { mockBoardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import BoardContextProvider from '@/components/BoardPage/BoardContext';
import DialogsProvider from '@/components/Mutation/Context/DialogsProvider';
import { useUpdateCardDialogActions } from '@/components/Mutation/Context/UpdateCardDialogContext';
import type { UpdateCardFormState } from '@/components/Mutation/Context/types';
import type { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing/react';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import UpdateCardDialog from '../../UpdateCardDialog';
import { initialUpdateCardForm } from './testMocks';

export const getAllElements = () => ({
  openButton: page.getByRole('button', { name: /open update card dialog/i }),
  header: page.getByRole('heading', { level: 2, name: /update card/i }),
  description: page.getByText(/edit this card title and color/i),
  titleInput: page.getByLabelText(/title/i),
  colorGroup: page.getByRole('radiogroup', { name: /color/i }),
  firstPalette: page.getByRole('radio', { name: /palette 1/i }),
  secondPalette: page.getByRole('radio', { name: /palette 2/i }),
  thirdPalette: page.getByRole('radio', { name: /palette 3/i }),
  cancelButton: page.getByRole('button', { name: /cancel/i }),
  saveButton: page.getByRole('button', { name: /save/i }),
});

export const openUpdateCardDialog = async () => {
  const { openButton } = getAllElements();
  await openButton.click();
};

function UpdateCardButton({ form }: { form: UpdateCardFormState }) {
  const { openUpdateCard } = useUpdateCardDialogActions();

  return (
    <button type='button' onClick={() => openUpdateCard(form)}>
      Open update card dialog
    </button>
  );
}

type RenderOptions = {
  cache?: InMemoryCache;
  initialForm?: UpdateCardFormState;
};
export const renderUpdateCardDialog = ({
  cache,
  initialForm = initialUpdateCardForm,
}: RenderOptions = {}) => {
  return render(
    <MockedProvider cache={cache}>
      <BoardContextProvider boardId={mockBoardId}>
        <DialogsProvider>
          <UpdateCardButton form={initialForm} />
          <UpdateCardDialog />
        </DialogsProvider>
      </BoardContextProvider>
    </MockedProvider>,
  );
};
