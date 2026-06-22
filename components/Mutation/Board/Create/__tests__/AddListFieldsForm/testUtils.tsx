import BoardContextWrapper from '@/components/BoardPage/BoardContext';
import { mockBoardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import AddListFieldProvider from '@/components/Mutation/Board/Create/AddListFieldContext';
import FieldsForm from '@/components/Mutation/Board/Create/FieldsForm';
import FieldsPreview from '@/components/Mutation/Board/Create/FieldsPreview';
import { MockedProvider } from '@apollo/client/testing/react';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';

export const CREATE_LIST_FIELDS_FAIL = {
  data: null,
  error: 'Failed to create list fields',
};

export const renderAddListFieldsForm = () => {
  return render(
    <MockedProvider>
      <BoardContextWrapper boardId={mockBoardId}>
        <AddListFieldProvider>
          <div className='grid grid-cols-2'>
            <FieldsForm />
            <FieldsPreview />
          </div>
        </AddListFieldProvider>
      </BoardContextWrapper>
    </MockedProvider>,
  );
};

export const getAllElements = () => ({
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
});
