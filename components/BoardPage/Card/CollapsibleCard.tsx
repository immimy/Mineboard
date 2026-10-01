'use client';

import { Button } from '@headlessui/react';
import clsx from 'clsx';
import { useCallback, useEffect, useId, useState } from 'react';
import type { ReactElement, Ref } from 'react';
import { CaretDownFillIcon } from '@/icons/icons';
import { ColorPalette } from '@/types/jsonbSchema';
import type { CardProps } from './Card';

const DRAG_EXPAND_DELAY_MS = 150;

export type CardMeasurementCallback = (
  element: HTMLElement | null,
  onOverflowChange: (hasOverflow: boolean) => void,
) => void | (() => void);

type CollapsibleCardRenderProps = {
  ref: Ref<HTMLElement>;
  contentId: string;
  isContentInert: boolean;
};

type CollapsibleCardProps = {
  children: (props: CollapsibleCardRenderProps) => ReactElement<CardProps>;
  title: string;
  color: ColorPalette;
  isSingleColumn?: boolean;
  onMeasurementChange?: CardMeasurementCallback;
  isListDragOver?: boolean;
};

function CollapsibleCard({
  children,
  title,
  color,
  isSingleColumn = true,
  onMeasurementChange,
  isListDragOver = false,
}: CollapsibleCardProps) {
  const [hasOverflow, setHasOverflow] = useState<boolean | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardContentId = useId();

  useEffect(() => {
    if (!isListDragOver || isSingleColumn || isExpanded) return;

    // Open short cards too: an incoming list may make them overflow once
    // measurement resumes. Expansion persists after leaving or ending a drag.
    const timer = setTimeout(() => setIsExpanded(true), DRAG_EXPAND_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isListDragOver, isSingleColumn, isExpanded]);

  const fadeCSS = `from-card-light-${color} via-card-light-${color}/90`;

  // Can collapse when not a single column and is overflow
  const canCollapse = !isSingleColumn && Boolean(hasOverflow);
  // Determines whether display as collapse or expand
  const isCollapsed = canCollapse && !isExpanded;
  // Display collapsed height by default when mounted (`hasOverflow` is null)
  // or when the card is collapsed (`hasOverflow` is true)
  const shouldUseCollapsedHeight =
    !isSingleColumn && hasOverflow !== false && !isExpanded;

  const measurementRefCallback = useCallback(
    (element: HTMLElement | null) =>
      onMeasurementChange?.(element, setHasOverflow),
    [onMeasurementChange],
  );

  return (
    <div
      className={clsx(
        'relative min-h-(--card-min-height)',
        shouldUseCollapsedHeight &&
          'h-(--card-min-height) overflow-hidden rounded-xl shadow',
      )}
    >
      {/* Render Card element */}
      {children({
        ref: measurementRefCallback,
        contentId: cardContentId,
        isContentInert: isCollapsed,
      })}

      {/* Expand/Collapse button */}
      {canCollapse ? (
        <Button
          type='button'
          aria-controls={cardContentId}
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title}`}
          title={`${isExpanded ? 'Collapse' : 'Expand'} ${title}`}
          data-card-disclosure-toggle
          data-open={isExpanded ? '' : undefined}
          onClick={() => setIsExpanded((current) => !current)}
          className={clsx(
            'group z-10 grid min-h-11 w-full place-items-center rounded-b-xl text-xs font-semibold text-muted-foreground transition-colors hover:cursor-pointer hover:text-foreground focus:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent',
            isCollapsed
              ? `absolute inset-x-0 bottom-0 h-16 items-end bg-linear-to-t ${fadeCSS} to-transparent pb-1`
              : 'relative',
          )}
        >
          <span className='flex min-h-10 items-center gap-1.5 px-4'>
            {isExpanded ? 'Show less' : 'Show more'}
            <CaretDownFillIcon className='size-3.5 shrink-0 transition-transform duration-200 group-data-open:rotate-180' />
          </span>
        </Button>
      ) : null}
    </div>
  );
}

export default CollapsibleCard;
