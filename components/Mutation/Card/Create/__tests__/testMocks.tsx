import { mockBoardId } from '@/components/Board/__tests__/singleBoardQuery.mock';
import * as BoardContext from '@/components/Board/BoardContext';
import { makeFragmentData } from '@/gql/__generated__';
import { CardQuery, CreatedCardFragmentDoc } from '@/gql/__generated__/graphql';
import { ColorPalette } from '@/types/jsonbSchema';

export const mockCloseAddCard = vi.fn();
export const mockedUseBoardContext = () => {
  vi.mocked(BoardContext.useBoardContext).mockReturnValue({
    boardId: mockBoardId,
    dbListFields: [],
    isAddCardOpen: true,
    openAddCard: vi.fn(),
    closeAddCard: mockCloseAddCard,
    isAddListOpen: false,
    closeAddList: vi.fn(),
    addListCardId: undefined,
    openAddList: vi.fn(),
  });
};

const createdCardNode = makeFragmentData(
  {
    __typename: 'cards',
    id: 'newCard',
    title: 'Career roadmap',
    position: 1,
    color: ColorPalette.third,
    listsCollection: {
      __typename: 'listsConnection',
      edges: [],
    },
  },
  CreatedCardFragmentDoc,
);

export const CREATE_CARD_SUCCESS: {
  data: CardQuery;
  error: null;
} = {
  error: null,
  data: {
    __typename: 'Query',
    cardsCollection: {
      __typename: 'cardsConnection',
      edges: [
        {
          __typename: 'cardsEdge',
          node: { __typename: 'cards', ...createdCardNode },
        },
      ],
    },
  },
};

export const CREATE_CARD_FAIL = {
  data: null,
  error: 'Failed to add card',
};
