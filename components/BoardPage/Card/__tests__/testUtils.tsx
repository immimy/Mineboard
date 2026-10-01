import { useCallback, useRef, useState } from 'react';
import CollapsibleCard, {
  type CardMeasurementCallback,
} from '../CollapsibleCard';
import { ColorPalette } from '@/types/jsonbSchema';

// This harness bypasses real card measurement and reports overflow directly
// to CollapsibleCard through its measurement callback.
export function DisclosureHarness({
  singleColumn = false,
}: {
  singleColumn?: boolean;
}) {
  const [isSingleColumn, setSingleColumn] = useState(singleColumn);
  const [isListDragOver, setListDragOver] = useState(false);
  const reportOverflowRef = useRef<(hasOverflow: boolean) => void>(null);
  const onMeasurementChange = useCallback<CardMeasurementCallback>(
    (element, reportOverflow) => {
      if (element) reportOverflowRef.current = reportOverflow;
    },
    [],
  );

  return (
    <>
      <button onClick={() => reportOverflowRef.current?.(true)}>
        Report overflow
      </button>
      <button onClick={() => reportOverflowRef.current?.(false)}>
        Report no overflow
      </button>
      <button onClick={() => setSingleColumn((current) => !current)}>
        Toggle columns
      </button>
      <button onClick={() => setListDragOver((current) => !current)}>
        Toggle list hover
      </button>
      <CollapsibleCard
        title='Tasks'
        color={ColorPalette.first}
        isSingleColumn={isSingleColumn}
        isListDragOver={isListDragOver}
        onMeasurementChange={onMeasurementChange}
      >
        {({ ref, contentId }) => (
          <article ref={ref} data-testid='card'>
            <h2>Tasks</h2>
            <ul id={contentId} data-testid='card-content'>
              <li>First task</li>
            </ul>
          </article>
        )}
      </CollapsibleCard>
    </>
  );
}
