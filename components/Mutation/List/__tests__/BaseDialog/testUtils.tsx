import { mockListFields } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import { ListFieldsCollectionFragment } from '@/gql/__generated__/graphql';
import { ListForm } from '@/types/app';
import { ListFieldInput } from '@/types/jsonbSchema';
import { useState } from 'react';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import ListDialog from '../../ListDialog';
import { initFormState } from '../../utils';

vi.mock('@/components/Mutation/List/ListInputs/ImageInput');

export const listFields =
  mockListFields.edges as ListFieldsCollectionFragment['edges'];

type ListDialogWrapperProps = {
  initialForm?: ListForm;
  initialOpen?: boolean;
};

const baseListAction = vi.fn(async () => ({ error: null }));

function ListDialogWrapper({
  initialForm = initFormState(listFields),
  initialOpen = false,
}: ListDialogWrapperProps) {
  const [open, setOpen] = useState(initialOpen);
  const [form, setForm] = useState<ListForm>(initialForm);

  const handleFieldChange = (fieldId: string, value: ListFieldInput) => {
    setForm((currentForm) => ({
      ...currentForm,
      [fieldId]: value,
    }));
  };

  return (
    <>
      <button type='button' onClick={() => setOpen(true)}>
        Open list dialog
      </button>
      <ListDialog
        formId='base_list'
        title='Base list'
        description='Shared list dialog.'
        open={open}
        listFields={listFields}
        form={form}
        onFieldChange={handleFieldChange}
        onClose={() => setOpen(false)}
        action={baseListAction}
      />
    </>
  );
}

export const renderListDialog = (props?: ListDialogWrapperProps) => {
  return render(<ListDialogWrapper {...props} />);
};

export const openListDialog = async () => {
  const { openButton } = getAllElements();
  await openButton.click();
};

export const getAllElements = () => {
  const inputs = page.getByRole('listitem');

  return {
    openButton: page.getByRole('button', { name: /open list dialog/i }),
    header: page.getByRole('heading', { name: /base list/i }),
    description: page.getByText(/shared list dialog/i),
    saveButton: page.getByRole('button', { name: /save/i }),
    cancelButton: page.getByRole('button', { name: /cancel/i }),
    checkboxList: inputs.nth(0),
    dateList: inputs.nth(1),
    textList: inputs.nth(2),
    tagList: inputs.nth(3),
    imageList: inputs.nth(4),
    numberList: inputs.nth(5),
    checkboxTitleInput: page.getByPlaceholder(/checklist/i),
    dateInput: page.getByLabelText(/deadline/i),
    textInput: page.getByLabelText(/note/i),
    tagInput: page.getByPlaceholder(/add tag/i),
    imageButton: page.getByRole('button', { name: /mock upload image/i }),
    numberInput: page.getByLabelText(/estimate/i),
  };
};
