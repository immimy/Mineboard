import BoardContextProvider from '@/components/BoardPage/BoardContext';
import { mockBoardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import FieldListFormProvider from '@/components/Mutation/Board/ListField/ListFieldFormContext';
import FieldsForm from '@/components/Mutation/Board/ListField/FieldsForm';
import FieldsPreview from '@/components/Mutation/Board/ListField/FieldsPreview';
import ListFieldDialog from '@/components/Mutation/Board/ListField/ListFieldDialog';
import DialogsProvider from '@/components/Mutation/Context/DialogsProvider';
import { useListFieldDialogActions } from '@/components/Mutation/Context/ListFieldDialogContext';
import type { FragmentType } from '@/gql/__generated__';
import { ListFieldsCollectionFragmentDoc } from '@/gql/__generated__/graphql';
import type { ApolloCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing/react';
import { Button } from '@headlessui/react';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import CardDeletionsProvider from '@/components/BoardPage/CardDeletionsContext';

type RenderListFieldOptions = {
  cache?: ApolloCache;
};

type RenderListFieldDialogOptions = RenderListFieldOptions & {
  queryListFields?: FragmentType<typeof ListFieldsCollectionFragmentDoc> | null;
};

function OpenListFieldDialogButton() {
  const { openListFieldDialog } = useListFieldDialogActions();

  return (
    <Button type='button' onClick={openListFieldDialog}>
      Open list field dialog
    </Button>
  );
}

export const renderListFieldForm = ({ cache }: RenderListFieldOptions = {}) => {
  return render(
    <MockedProvider cache={cache}>
      <BoardContextProvider boardId={mockBoardId}>
        <CardDeletionsProvider>
          <DialogsProvider>
            <FieldListFormProvider>
              <div className='grid grid-cols-2'>
                <FieldsForm />
                <FieldsPreview />
              </div>
            </FieldListFormProvider>
          </DialogsProvider>
        </CardDeletionsProvider>
      </BoardContextProvider>
    </MockedProvider>,
  );
};

export const renderListFieldDialog = ({
  cache,
  queryListFields = null,
}: RenderListFieldDialogOptions = {}) => {
  return render(
    <MockedProvider cache={cache}>
      <BoardContextProvider
        boardId={mockBoardId}
        queryListFields={queryListFields}
      >
        <CardDeletionsProvider>
          <DialogsProvider>
            <OpenListFieldDialogButton />
            <ListFieldDialog />
          </DialogsProvider>
        </CardDeletionsProvider>
      </BoardContextProvider>
    </MockedProvider>,
  );
};

export const getAllElements = () => ({
  openDialogButton: page.getByRole('button', {
    name: /open list field dialog/i,
  }),
  dialog: page.getByRole('dialog'),
  closeDialogButton: page.getByRole('button', {
    name: /close list fields dialog/i,
  }),
  resetButton: page.getByRole('button', { name: /^reset$/i }),
  alert: {
    cancelButton: page.getByRole('button', { name: /^cancel$/i }),
    closeButton: page.getByRole('button', { name: /^close$/i }),
    continueButton: page.getByRole('button', { name: /^continue$/i }),
    discardMessage: page.getByText(
      /you have unsaved list field changes\. close without saving\?/i,
    ),
    removeMessage: page.getByText(
      /removing this field will delete its existing list values\. continue\?/i,
    ),
    typeChangeMessage: page.getByText(
      /changing the type of an existing list field will delete list values that use this field\. continue\?/i,
    ),
  },
  addFieldButton: {
    text: page.getByRole('button', { name: /^text$/i }),
    number: page.getByRole('button', { name: /^number$/i }),
    date: page.getByRole('button', { name: /^date$/i }),
    image: page.getByRole('button', { name: /^image$/i }),
    checkbox: page.getByRole('button', { name: /^checkbox$/i }),
    tag: page.getByRole('button', { name: /^tag$/i }),
  },
  titleInput: {
    text: page.getByPlaceholder('Text Title (optional)'),
    number: page.getByPlaceholder('Number Title (optional)'),
    date: page.getByPlaceholder('Date Title (optional)'),
    image: page.getByPlaceholder('Image Title (optional)'),
  },
  fieldActionButton: {
    text: {
      changeType: page.getByRole('button', {
        name: /change text field type/i,
      }),
      remove: page.getByRole('button', { name: /remove text field/i }),
    },
    number: {
      changeType: page.getByRole('button', {
        name: /change number field type/i,
      }),
    },
    date: {
      remove: page.getByRole('button', { name: /remove date field/i }),
    },
  },
  unitSwitch: page.getByRole('switch', { name: /^unit$/i }),
  unitLabelInput: page.getByPlaceholder('e.g. "$", "°C", "hours"'),
  saveButton: page.getByRole('button', { name: /^save$/i }),
  previewCardTitle: page.getByText('Preview card'),
  listFieldsFormIntro: page.getByText(/personalize the list item/i),
});
