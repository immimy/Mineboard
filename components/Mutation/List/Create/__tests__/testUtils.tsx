import {
  mockBoardId,
  mockCardId,
  mockListFields,
} from '@/components/Board/__tests__/singleBoardQuery.mock';
import BoardContextWrapper from '@/components/Board/BoardContext';
import { ListFieldsCollectionFragment } from '@/gql/__generated__/graphql';
import { MockedProvider } from '@apollo/client/testing/react';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import AddListOpenButton from '../AddListOpenButton';
import AddListDialog from '../AddListDialog';
import { ApolloCache } from '@apollo/client';

export const getAllElements = () => {
  const inputs = page.getByRole('listitem');
  return {
    addListDialogButton: page.getByRole('button', { name: /add list/i }),
    header: page.getByRole('heading', { level: 2, name: /create list/i }),
    cancelButton: page.getByRole('button', { name: /cancel/i }),
    saveButton: page.getByRole('button', { name: /save/i }),
    checkboxList: inputs.nth(0),
    dateList: inputs.nth(1),
    textList: inputs.nth(2),
    tagList: inputs.nth(3),
    imageList: inputs.nth(4),
    numberList: inputs.nth(5),
  };
};

export const renderAddListDialog = (cache?: ApolloCache) => {
  return render(
    <MockedProvider cache={cache}>
      <BoardContextWrapper
        boardId={mockBoardId}
        queryListFields={
          mockListFields as {
            ' $fragmentRefs'?: {
              ListFieldsCollectionFragment: ListFieldsCollectionFragment;
            };
          }
        }
      >
        <AddListOpenButton cardId={mockCardId} />
        <AddListDialog />
      </BoardContextWrapper>
    </MockedProvider>,
  );
};
