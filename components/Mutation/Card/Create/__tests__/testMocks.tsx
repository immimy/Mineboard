import { mockBoardId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';
import * as BoardContext from '@/components/BoardPage/BoardContext';
import { makeFragmentData } from '@/gql/__generated__';
import {
  CachedCardQuery,
  ListsCollectionFragmentDoc,
} from '@/gql/__generated__/graphql';
import { ColorPalette } from '@/types/jsonbSchema';

export const mockCloseAddCard = vi.fn();
export const mockedUseBoardContext = () => {
  vi.mocked(BoardContext.useBoardContext).mockReturnValue({
    boardId: mockBoardId,
    dbListFields: [],
    isAddListFieldOpen: false,
    openAddListField: vi.fn(),
    closeAddListField: vi.fn(),
    isAddCardOpen: true,
    openAddCard: vi.fn(),
    closeAddCard: mockCloseAddCard,
    isAddListOpen: false,
    closeAddList: vi.fn(),
    addListCardId: undefined,
    openAddList: vi.fn(),
  });
};

const createdCardEdge = {
  __typename: 'cardsEdge',
  node: {
    __typename: 'cards',
    id: 'newCard',
    title: 'Career roadmap',
    position: 1,
    color: ColorPalette.third,
    listsCollection: {
      __typename: 'listsConnection',
      ...makeFragmentData(
        {
          __typename: 'listsConnection',
          edges: [],
        },
        ListsCollectionFragmentDoc,
      ),
    },
  },
} satisfies NonNullable<CachedCardQuery['cardsCollection']>['edges'][number];

export const CREATE_CARD_SUCCESS: {
  data: CachedCardQuery;
  error: null;
} = {
  error: null,
  data: {
    __typename: 'Query',
    cardsCollection: {
      __typename: 'cardsConnection',
      edges: [createdCardEdge],
    },
  },
};

export const CREATE_CARD_FAIL = {
  data: null,
  error: 'Failed to add card',
};
