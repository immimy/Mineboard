'use client';

import {
  useListFieldDialogActions,
  useListFieldDialogState,
} from '@/components/Mutation/Context/ListFieldDialogContext';
import { useBoardContext } from '@/components/BoardPage/BoardContext';
import { XIcon } from '@/icons/icons';
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react';
import FieldsForm from './FieldsForm';
import FieldsPreview from './FieldsPreview';
import ListFieldFormProvider, {
  useListFieldFormContext,
} from './ListFieldFormContext';
import { type ComponentType, useMemo, useState } from 'react';
import { initFormState } from './utils';
import ConfirmAlertDialog from '@/components/global/ConfirmAlertDialog';

const tabs = ['List Fields Form', 'Preview'];
const tabPanels = [FieldsForm, FieldsPreview];

function ListFieldDialog() {
  const { isOpen } = useListFieldDialogState();
  const { dbListFields } = useBoardContext();
  const initialFields = useMemo(
    () => initFormState(dbListFields),
    [dbListFields],
  );

  return (
    <ListFieldFormProvider
      key={isOpen ? 'open' : 'closed'}
      initialFields={initialFields}
    >
      <ListFieldDialogContent isOpen={isOpen} />
    </ListFieldFormProvider>
  );
}
export default ListFieldDialog;

type ListFieldDialogContentProps = {
  isOpen: boolean;
};

function ListFieldDialogContent({ isOpen }: ListFieldDialogContentProps) {
  const { closeListFieldDialog } = useListFieldDialogActions();
  const { isDirty } = useListFieldFormContext();

  // Unsaved alert
  const [isUnsavedAlertOpen, setIsUnsavedAlertOpen] = useState(false);

  const handleCloseDialog = () => {
    if (!isDirty) {
      closeListFieldDialog();
      return;
    }

    // Trigger unsaved alert
    setIsUnsavedAlertOpen(true);
  };

  return (
    <Dialog open={isOpen} onClose={handleCloseDialog} className='relative z-50'>
      <DialogBackdrop className='fixed inset-0 bg-neutral-foreground/30 dark:bg-neutral/30' />

      <div className='fixed inset-0 w-screen p-4 overflow-x-clip overflow-y-auto lg:overflow-visible'>
        <DialogPanel className='relative mx-auto mt-10 w-full max-w-lg text-foreground md:max-w-3xl lg:max-w-5xl'>
          {/* Close Dialog Button */}
          <Button
            type='button'
            aria-label='Close list fields dialog'
            onClick={handleCloseDialog}
            className='absolute right-4 -top-5 z-10 -translate-y-1/2 translate-x-1/2 hover:cursor-pointer stroke-2 stroke-foreground hover:stroke-destructive/80'
          >
            <XIcon className='size-6' />
          </Button>

          {/* Dialog Content */}
          <TabGroupTemplate tabs={tabs} tabPanels={tabPanels} />
        </DialogPanel>
      </div>

      {/* Unsaved Alert */}
      <ConfirmAlertDialog
        isOpen={isUnsavedAlertOpen}
        title='Discard changes?'
        description='You have unsaved list field changes. Close without saving?'
        confirmText='Close'
        onClose={() => setIsUnsavedAlertOpen(false)}
        onConfirm={closeListFieldDialog}
      />
    </Dialog>
  );
}

type TabGroupTemplateProps = {
  tabs: string[];
  tabPanels: ComponentType[];
};

function TabGroupTemplate({ tabs, tabPanels }: TabGroupTemplateProps) {
  return (
    <TabGroup>
      <TabList className='grid grid-cols-2 rounded-t border border-border bg-muted p-1 lg:hidden'>
        {tabs.map((tab) => {
          return (
            <Tab
              key={tab}
              className='min-h-11 first:rounded-l last:rounded-r px-3 py-2 text-sm font-semibold text-muted-foreground outline-none data-selected:bg-accent/90 data-selected:text-foreground dark:data-selected:text-background data-selected:shadow-sm'
            >
              {tab}
            </Tab>
          );
        })}
      </TabList>
      <TabPanels className='lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.85fr)] bg-background rounded-b lg:rounded-t border border-border shadow-sm'>
        {tabPanels.map((Panel, index) => (
          <TabPanel
            key={tabs[index]}
            static
            className='hidden lg:block data-selected:block'
          >
            <Panel />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
