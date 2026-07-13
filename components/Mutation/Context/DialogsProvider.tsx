'use client';

import { PropsWithChildren } from 'react';
import { AddCardDialogProvider } from './AddCardDialogContext';
import { AddListDialogProvider } from './AddListDialogContext';
import { ListFieldDialogProvider } from './ListFieldDialogContext';
import { UpdateCardDialogProvider } from './UpdateCardDialogContext';
import { UpdateListDialogProvider } from './UpdateListDialogContext';

function DialogsProvider({ children }: PropsWithChildren) {
  return (
    <ListFieldDialogProvider>
      <AddCardDialogProvider>
        <AddListDialogProvider>
          <UpdateCardDialogProvider>
            <UpdateListDialogProvider>{children}</UpdateListDialogProvider>
          </UpdateCardDialogProvider>
        </AddListDialogProvider>
      </AddCardDialogProvider>
    </ListFieldDialogProvider>
  );
}

export default DialogsProvider;
