import { PlusIcon } from '@/icons/icons';
import FieldInput from '../Fields';
import { fieldTypeOptions } from '@/types/jsonbSchema';
import { Button } from '@headlessui/react';
import { useAddListFieldContext } from './AddListFieldContext';
import FormContainer from '@/components/global/FormContainer';
import { ActionFunction } from '@/types/app';
import SubmitButton from '@/components/global/SubmitButton';
import { useApolloClient } from '@apollo/client/react';
import { useBoardContext } from '@/components/BoardPage/BoardContext';
import { createListFields } from '@/utils/actions/board';
import {
  CachedListFieldsDocument,
  CachedListFieldsQuery,
  CachedListFieldsQueryVariables,
} from '@/gql/__generated__/graphql';

function FieldsForm() {
  const client = useApolloClient();
  const { boardId, closeAddListField } = useBoardContext();
  const {
    fields,
    addField,
    updateField,
    updateFieldType,
    removeField,
    resetFields,
  } = useAddListFieldContext();

  const handleSave: ActionFunction = async () => {
    // Server: Create list fields
    const { data, error } = await createListFields(boardId, fields);
    if (error || !data) return { error };

    // Update list fields query in `SingleBoardQuery` by overriding
    client.cache.writeQuery<
      CachedListFieldsQuery,
      CachedListFieldsQueryVariables
    >({
      query: CachedListFieldsDocument,
      variables: { boardId },
      data,
    });

    // Reset state & Close dialog
    resetFields();
    closeAddListField();

    return { error: null };
  };

  return (
    <section
      aria-labelledby='list-fields-form-heading'
      className='min-h-80 p-4 md:p-5 lg:max-h-[75vh] lg:overflow-auto'
    >
      {/* Header */}
      <div className='border-b border-border pb-4'>
        <h6 className='hidden lg:block font-semibold tracking-wider text-accent'>
          List Fields Form
        </h6>
        <p className='mt-1 text-sm text-muted-foreground'>
          Personalize the list item to your preference
        </p>
      </div>

      <div className='mt-4 grid gap-3'>
        {/* List Fields */}
        {fields.length === 0 ? (
          <div className='rounded border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground text-center'>
            Add a field to start building the list layout.
          </div>
        ) : (
          <FormContainer action={handleSave}>
            <div className='grid gap-1.5'>
              {fields.map((field) => (
                <FieldInput
                  key={field.id}
                  field={field}
                  onConfigChange={updateField}
                  onTypeChange={(type) => updateFieldType(field.id, type)}
                  onRemove={() => removeField(field.id)}
                />
              ))}
            </div>
            <SubmitButton
              text='Save'
              className='mt-4 mb-6 bg-accent rounded shadow-sm py-1 min-h-8 text-foreground dark:text-background/80'
            />
          </FormContainer>
        )}

        {/* Add Field Button */}
        <div className='rounded border border-dashed border-border bg-muted/30 p-3'>
          <span className='text-sm font-semibold text-foreground capitalize'>
            Add field
          </span>
          <div className='mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3'>
            {fieldTypeOptions.map((type) => (
              <Button
                key={type}
                type='button'
                onClick={() => addField(type)}
                className='flex min-h-11 items-center justify-center gap-2 rounded border border-border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground outline-none transition hover:border-accent hover:text-accent focus:ring-2 focus:ring-accent/70 capitalize'
              >
                <PlusIcon />
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FieldsForm;
