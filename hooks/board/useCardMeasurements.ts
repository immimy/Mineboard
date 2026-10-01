'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { CardMeasurementCallback } from '@/components/BoardPage/Card/CollapsibleCard';

type CardMeasurementRegistration = {
  cardElement: HTMLElement;
  hasOverflow?: boolean;
  onOverflowChange: (hasOverflow: boolean) => void;
};

type UseCardMeasurementsOptions = {
  isDragging: boolean;
  minHeight: number;
};

export default function useCardMeasurements({
  isDragging,
  minHeight,
}: UseCardMeasurementsOptions) {
  const cardsGridRef = useRef<HTMLElement>(null);
  // Card measurement observation
  const isCardObserverEnabledRef = useRef(false);
  const cardObserverRef = useRef<ResizeObserver | null>(null);
  const cardRegistrationsRef = useRef(
    new Map<Element, CardMeasurementRegistration>(),
  );
  // Column count decides whether the collapsible card is enabled
  const [columnCount, setColumnCount] = useState(1);
  const isSingleColumn = columnCount < 2;

  // Registers each cards to the observer
  // For the first mount, this callback register the card element
  // but no observation since the observer is not initialized yet.
  // The card will be observed when the `useLayoutEffect` runs later.
  const registerCardMeasurement = useCallback<CardMeasurementCallback>(
    (element, onOverflowChange) => {
      if (!element) return;

      const registrations = cardRegistrationsRef.current;

      const newRegistration = { cardElement: element, onOverflowChange };
      if (isCardObserverEnabledRef.current) {
        cardObserverRef.current?.observe(element, { box: 'border-box' });
      }
      registrations.set(element, newRegistration);

      return () => {
        cardObserverRef.current?.unobserve(element);
        registrations.delete(element);
      };
    },
    [],
  );

  // Initializes observer for all cards
  useLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const registration = cardRegistrationsRef.current.get(entry.target);
        if (!registration) return;

        const hasOverflow = getObservedCardHeight(entry) - minHeight > 1;
        if (registration.hasOverflow === hasOverflow) return;

        registration.hasOverflow = hasOverflow;
        registration.onOverflowChange(hasOverflow);
      });
    });

    cardObserverRef.current = observer;

    return () => {
      observer.disconnect();
      cardObserverRef.current = null;
    };
  }, [minHeight]);

  // Initializes observer for cards container width change
  // Updates the column count to reflect current layout
  useLayoutEffect(() => {
    const cardsGrid = cardsGridRef.current;
    if (!cardsGrid) return;

    // Counts the card columns from real rendered layout
    const updateColumnCount = () => {
      const gridTemplateColumns = window
        .getComputedStyle(cardsGrid)
        .gridTemplateColumns.trim();
      const nextColumnCount =
        gridTemplateColumns === 'none'
          ? 1
          : gridTemplateColumns.split(/\s+/).length;

      setColumnCount((currentColumnCount) =>
        currentColumnCount === nextColumnCount
          ? currentColumnCount
          : nextColumnCount,
      );
    };

    // For the first mount, triggers the re-render if the layout is not a single column.
    updateColumnCount();

    // Attaches an observer to cards containers
    const gridObserver = new ResizeObserver(updateColumnCount);
    gridObserver.observe(cardsGrid);

    return () => gridObserver.disconnect();
  }, []);

  // Observes or disconnects the observer from all cards
  // For the first mount, this effect picks up the card registrations in the second render and make an observation if `shouldObserveCards` is enabled.
  // Disconnects if:
  // - Layout contains one column
  // - User is dragging some elements
  useLayoutEffect(() => {
    const shouldObserveCards = !isSingleColumn && !isDragging;
    const observer = cardObserverRef.current;

    isCardObserverEnabledRef.current = shouldObserveCards;
    observer?.disconnect();
    if (!shouldObserveCards || !observer) return;

    cardRegistrationsRef.current.forEach(({ cardElement }) => {
      observer.observe(cardElement, { box: 'border-box' });
    });
  }, [isSingleColumn, isDragging, minHeight]);

  return { cardsGridRef, isSingleColumn, registerCardMeasurement };
}

function getObservedCardHeight(entry: ResizeObserverEntry) {
  return (
    entry.borderBoxSize?.[0]?.blockSize ??
    entry.target.getBoundingClientRect().height
  );
}
