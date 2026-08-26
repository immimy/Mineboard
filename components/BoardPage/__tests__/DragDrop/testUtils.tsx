import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import BoardContextProvider from '../../BoardContext';
import CardDeletionsProvider from '../../CardDeletionsContext';
import CardsContainer from '../../CardsContainer';
import DialogsProvider from '@/components/Mutation/Context/DialogsProvider';
import { createCardsQuery } from './testMocks';

const BOARD_LAYOUT_SAVE_DEBOUNCE_MS = 1000;

export const renderBoard = () =>
  render(
    <BoardContextProvider boardId='board-id'>
      <CardDeletionsProvider>
        <DialogsProvider>
          <div data-testid='outside-board'>Outside board</div>
          <CardsContainer query={createCardsQuery()} />
        </DialogsProvider>
      </CardDeletionsProvider>
    </BoardContextProvider>,
  );

export const getAllElements = () => {
  const cards = page.getByRole('article');

  return {
    cards,
    outsideBoard: page.getByTestId('outside-board'),
    card: (title: string) => cards.filter({ hasText: title }),
    cardHandle: (title: string) =>
      page.getByRole('button', { name: `Drag ${title}` }),
    // Keep test indexes zero-based like useSortable; the accessible label is one-based for users.
    listHandle: (index: number, cardTitle: string) =>
      page.getByRole('button', {
        name: `Drag list ${index + 1} of ${cardTitle}`,
      }),
  };
};

const waitForNextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export const waitForDndToSettle = async () => {
  // Allow dnd-kit to enter its dropping phase after the pointer is released.
  await waitForNextFrame();

  // dnd-kit removes this attribute when its drop animation finishes.
  await vi.waitFor(() => {
    expect(document.querySelector('[data-dnd-dropping]')).toBeNull();
  });

  // Allow the final dnd-kit signal and React updates to commit.
  await waitForNextFrame();
};

export const dragAndDrop = async (
  ...args: Parameters<typeof userEvent.dragAndDrop>
) => {
  await userEvent.dragAndDrop(...args);
  await waitForDndToSettle();
};

export const useFakeBoardSaveTimer = () => {
  // Keep requestAnimationFrame real so dnd-kit can finish its drop animation.
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
};

export const advanceBoardSaveDebounce = async () => {
  await vi.advanceTimersByTimeAsync(BOARD_LAYOUT_SAVE_DEBOUNCE_MS);
};

export const expectCardOrder = async (titles: string[]) => {
  const { cards } = getAllElements();

  await vi.waitFor(() => {
    titles.forEach((title, index) => {
      expect(cards.nth(index).element()).toHaveTextContent(title);
    });
  });
};

export const expectListTextFieldValues = async (
  cardTitle: string,
  textFieldValues: string[],
) => {
  const { card } = getAllElements();
  const targetCard = card(cardTitle);

  await vi.waitFor(() => {
    const listContainer = targetCard.element().querySelector(':scope > ul');
    expect(listContainer).not.toBeNull();

    const listItems = listContainer?.querySelectorAll(':scope > li') ?? [];
    expect(listItems).toHaveLength(textFieldValues.length);

    textFieldValues.forEach((textFieldValue, index) => {
      expect(listItems[index]).toHaveTextContent(textFieldValue);
    });
  });
};
