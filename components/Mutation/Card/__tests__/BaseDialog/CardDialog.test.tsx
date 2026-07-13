import { page } from 'vitest/browser';
import { ColorPalette } from '@/types/jsonbSchema';
import { render } from 'vitest-browser-react';
import { useState } from 'react';
import CardDialog, {
  CardFormState,
} from '@/components/Mutation/Card/CardDialog';

type CardDialogWrapperProps = {
  initialForm?: CardFormState;
  initialOpen?: boolean;
};

const CardDialogWrapper = ({
  initialForm = { title: '', color: ColorPalette.first },
  initialOpen = true,
}: CardDialogWrapperProps) => {
  const [open, setOpen] = useState(initialOpen);
  const [form, setForm] = useState<CardFormState>(initialForm);

  return (
    <>
      <button type='button' onClick={() => setOpen(true)}>
        Open card dialog
      </button>
      <CardDialog
        formId='base_card'
        title='Base card'
        description='Shared card dialog.'
        open={open}
        form={form}
        onFormChange={setForm}
        onClose={() => setOpen(false)}
        action={vi.fn(async () => ({ error: null }))}
      />
    </>
  );
};

const renderDialog = (props?: CardDialogWrapperProps) => {
  return render(<CardDialogWrapper {...props} />);
};

const getAllElements = () => {
  return {
    header: page.getByRole('heading', { name: /base card/i }),
    description: page.getByText(/shared card dialog/i),
    saveButton: page.getByRole('button', { name: /save/i }),
    cancelButton: page.getByRole('button', { name: /cancel/i }),
    titleInput: page.getByLabelText(/title/i),
    colorGroup: page.getByRole('radiogroup', { name: /color/i }),
    firstPalette: page.getByRole('radio', { name: /palette 1/i }),
    thirdPalette: page.getByRole('radio', { name: /palette 3/i }),
  };
};

describe('CardDialog base UI', () => {
  it('renders the card form dialog correctly', async () => {
    renderDialog();

    const {
      header,
      description,
      titleInput,
      colorGroup,
      firstPalette,
      saveButton,
      cancelButton,
    } = getAllElements();

    // Dialog Header
    await expect.element(header).toBeVisible();
    await expect.element(description).toBeVisible();

    // Form Inputs
    await expect.element(titleInput).toBeVisible();
    expect(titleInput).toHaveAttribute('required');

    await expect.element(colorGroup).toBeVisible();
    expect(firstPalette).toBeChecked();

    // Buttons
    await expect.element(cancelButton).toBeVisible();
    await expect.element(saveButton).toBeVisible();
  });

  it('renders the inputs from the provided form state', async () => {
    renderDialog({
      initialForm: { title: 'Existing card', color: ColorPalette.third },
    });

    const { titleInput, thirdPalette } = getAllElements();

    await expect.element(titleInput).toHaveValue('Existing card');
    await expect.element(thirdPalette).toBeChecked();
  });

  it('opens and closes from the controlled dialog state', async () => {
    renderDialog({ initialOpen: false });

    const { header, cancelButton, saveButton } = getAllElements();
    const openButton = page.getByRole('button', {
      name: /open card dialog/i,
    });

    expect(header.query()).toBe(null);

    await openButton.click();

    await expect.element(header).toBeVisible();
    await expect.element(cancelButton).toBeVisible();
    await expect.element(saveButton).toBeVisible();

    await cancelButton.click();

    expect(header.query()).toBe(null);
    expect(cancelButton.query()).toBe(null);
    expect(saveButton.query()).toBe(null);
  });
});
