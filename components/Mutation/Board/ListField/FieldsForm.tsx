import { PlusIcon } from '@/icons/icons';
import FieldInput from '../Fields';
import { fieldTypeOptions } from '@/types/jsonbSchema';
import { Button } from '@headlessui/react';
import { useListFieldFormContext } from './ListFieldFormContext';
import FormContainer from '@/components/global/FormContainer';
import { ActionFunction } from '@/types/app';
import SubmitButton from '@/components/global/SubmitButton';
import { useApolloClient } from '@apollo/client/react';
import { useBoardContext } from '@/components/BoardPage/BoardContext';
import { useListFieldDialogActions } from '@/components/Mutation/Context/ListFieldDialogContext';
import { createListFields, updateListFields } from '@/utils/actions/board';
import {
  CachedBoardListsDocument,
  CachedBoardListsQuery,
  CachedBoardListsQueryVariables,
  CachedListFieldsDocument,
  CachedListFieldsQuery,
  CachedListFieldsQueryVariables,
  Field_Type,
} from '@/gql/__generated__/graphql';
import { useMemo, useState } from 'react';
import ConfirmAlertDialog from '@/components/global/ConfirmAlertDialog';
import {
  DragDropProvider,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
} from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';

// Drag sensor configuration
const dragSensors = [
  PointerSensor.configure({
    activatorElements(source) {
      return [source.handle];
    },
  }),
  KeyboardSensor,
];

// Confirmation alert
type PendingConfirmation = {
  message: string;
  onConfirm: () => void;
} | null;

function FieldsForm() {
  const client = useApolloClient();
  const { boardId, dbListFields } = useBoardContext();
  const { closeListFieldDialog } = useListFieldDialogActions();
  const {
    fields,
    isDirty,
    addField,
    updateField,
    updateFieldType,
    reorderField,
    removeField,
    resetFields,
  } = useListFieldFormContext();

  // Destructive alert: type change or remove on existing fields
  const [pendingConfirmation, setPendingConfirmation] =
    useState<PendingConfirmation>(null);
  // UX: Store field ids that have been confirmed for changes
  const [confirmedTypeChangeFieldIds, setConfirmedTypeChangeFieldIds] =
    useState<Set<string>>(() => new Set());

  const dbFieldById = useMemo(
    () =>
      new Map(dbListFields?.map(({ node }) => [node.id, node] as const) ?? []),
    [dbListFields],
  );
  const mode = dbFieldById.size ? 'update' : 'create';

  // Close alert dialog
  const closeAlert = () => setPendingConfirmation(null);

  // Reset form to its initial state
  const handleResetFields = () => {
    resetFields();
    setConfirmedTypeChangeFieldIds(new Set());
    closeAlert();
  };

  // Remove field handler
  const handleRemoveField = (fieldId: string) => {
    if (!dbFieldById.has(fieldId)) {
      removeField(fieldId);
      return;
    }

    setPendingConfirmation({
      message:
        'Removing this field will delete its existing list values. Continue?',
      onConfirm: () => removeField(fieldId),
    });
  };

  // Type change handler
  const handleTypeChange = (fieldId: string, currentType: Field_Type) => {
    return (nextType: Field_Type) => {
      if (nextType === currentType) return;

      const dbField = dbFieldById.get(fieldId);
      const isConfirmedTypeChange = confirmedTypeChangeFieldIds.has(fieldId);

      if (!dbField || nextType === dbField.type || isConfirmedTypeChange) {
        updateFieldType(fieldId, nextType);
        return;
      }

      setPendingConfirmation({
        message:
          'Changing the type of an existing list field will delete list values that use this field. Continue?',
        onConfirm: () => {
          setConfirmedTypeChangeFieldIds((currentIds) => {
            const nextIds = new Set(currentIds);
            nextIds.add(fieldId);
            return nextIds;
          });
          updateFieldType(fieldId, nextType);
        },
      });
    };
  };

  // Re-order field on drag end
  const handleFieldDragEnd = ({ canceled, operation }: DragEndEvent) => {
    const source = operation.source;
    if (canceled || !isSortable(source)) return;
    if (source.type !== 'list-field' || source.initialIndex === source.index)
      return;

    reorderField(String(source.id), source.index);
  };

  // Form submission: create or update list fields
  const handleSave: ActionFunction = async () => {
    let listFieldsCacheUpdate: CachedListFieldsQuery;
    let boardListsCacheUpdate: CachedBoardListsQuery | null = null;

    /** 1. Update Mode */
    if (mode === 'update') {
      // Server: Update list fields
      const { data, error } = await updateListFields(boardId, fields);
      if (error || !data) return { error };
      listFieldsCacheUpdate = data.listFields;
      boardListsCacheUpdate = data.boardLists;
    } else {
      /** 2. Create Mode */
      // Server: Create list fields
      const { data, error } = await createListFields(boardId, fields);
      if (error || !data) return { error };
      listFieldsCacheUpdate = data;
    }

    // Update list fields query in `SingleBoardQuery` by overriding
    client.cache.writeQuery<
      CachedListFieldsQuery,
      CachedListFieldsQueryVariables
    >({
      query: CachedListFieldsDocument,
      variables: { boardId },
      data: listFieldsCacheUpdate,
    });

    // Update lists on the board in `SingleBoardQuery` by overriding
    if (boardListsCacheUpdate) {
      client.cache.writeQuery<
        CachedBoardListsQuery,
        CachedBoardListsQueryVariables
      >({
        query: CachedBoardListsDocument,
        variables: { boardId },
        data: boardListsCacheUpdate,
      });

      // Cleaning orphaned keys from the normalized cache
      // Caveat: this relies on removed list_values being referenced only by this
      // board lists query. If another cached query can reference them, gc() will
      // keep those records until that query is also overwritten or evicted.
      client.cache.gc();
    }

    // Close dialog after the action finish
    // No need to reset form state because the form provider already remounts on close/open with latest fields.
    closeListFieldDialog();

    return { error: null };
  };

  return (
    <section
      aria-labelledby='list-fields-form-heading'
      className='min-h-80 p-4 md:p-5 lg:max-h-[75vh] lg:overflow-auto'
    >
      {/* Header */}
      <div className='flex items-start justify-between gap-3 border-b border-border pb-4'>
        {/* Title & Description */}
        <div>
          <h6 className='hidden lg:block font-semibold tracking-wider text-accent'>
            List Fields Form
          </h6>
          <p className='mt-1 text-sm text-muted-foreground'>
            Personalize the list item to your preference
          </p>
        </div>

        {/* Reset Form Button */}
        <Button
          type='button'
          disabled={!isDirty}
          onClick={handleResetFields}
          className='min-h-8 shrink-0 rounded border border-border bg-background px-3 py-1 text-sm font-semibold text-muted-foreground outline-none transition enabled:hover:border-accent enabled:hover:text-accent disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-accent/70'
        >
          Reset
        </Button>
      </div>

      <div className='mt-4 grid gap-3'>
        {/* List Fields */}
        {fields.length === 0 ? (
          <div className='rounded border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground text-center'>
            Add a field to start building the list layout.
          </div>
        ) : (
          <FormContainer action={handleSave}>
            <DragDropProvider
              sensors={dragSensors}
              onDragEnd={handleFieldDragEnd}
            >
              <div className='grid gap-1.5'>
                {fields.map((field) => (
                  <FieldInput
                    key={field.id}
                    field={field}
                    onConfigChange={updateField}
                    onTypeChange={handleTypeChange(field.id, field.type)}
                    onRemove={() => handleRemoveField(field.id)}
                  />
                ))}
              </div>
            </DragDropProvider>
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

      {/* Destructive Alert */}
      <ConfirmAlertDialog
        isOpen={Boolean(pendingConfirmation)}
        description={pendingConfirmation?.message ?? ''}
        onClose={closeAlert}
        onConfirm={pendingConfirmation?.onConfirm ?? closeAlert}
      />
    </section>
  );
}

export default FieldsForm;
