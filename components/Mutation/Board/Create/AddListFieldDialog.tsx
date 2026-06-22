'use client';

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
import AddListFieldProvider from './AddListFieldContext';
import { type ComponentType } from 'react';

const tabs = ['List Fields Form', 'Preview'];
const tabPanels = [FieldsForm, FieldsPreview];

function AddListFieldDialog() {
  const { isAddListFieldOpen, closeAddListField } = useBoardContext();
  return (
    <Dialog
      open={isAddListFieldOpen}
      onClose={closeAddListField}
      className='relative z-50'
    >
      <DialogBackdrop className='fixed inset-0 bg-neutral-foreground/30 dark:bg-neutral/30' />
      <div className='fixed inset-0 w-screen p-4 overflow-auto lg:overflow-visible'>
        <DialogPanel className='relative mx-auto mt-10 w-full max-w-lg text-foreground md:max-w-3xl lg:max-w-5xl'>
          {/* Close Dialog Button */}
          <Button
            type='button'
            aria-label='Close list fields dialog'
            onClick={closeAddListField}
            className='absolute right-4 -top-5 z-10 -translate-y-1/2 translate-x-1/2 hover:cursor-pointer stroke-2 stroke-foreground hover:stroke-destructive/80'
          >
            <XIcon className='size-6' />
          </Button>

          {/* Dialog Content */}
          <AddListFieldProvider>
            <TabGroupTemplate tabs={tabs} tabPanels={tabPanels} />
          </AddListFieldProvider>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
export default AddListFieldDialog;

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
