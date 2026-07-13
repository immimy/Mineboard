import Card from '@/components/BoardPage/Card';
import { makeFragmentData } from '@/gql/__generated__';
import {
  CardFragmentDoc,
  ListFragmentDoc,
  ListsCollectionFragmentDoc,
  ListValuesFragmentDoc,
  type CardFragment,
  type ListFragment,
  type ListsCollectionFragment,
  type ListValuesFragment,
} from '@/gql/__generated__/graphql';
import { ColorPalette, type ListFieldDraft } from '@/types/jsonbSchema';
import { type ComponentProps } from 'react';
import { createPreviewData } from '../Fields/utils';
import { useListFieldFormContext } from './ListFieldFormContext';

function FieldsPreview() {
  const { fields } = useListFieldFormContext();
  const previewCardQuery = createPreviewCardQuery(fields);

  return (
    <section
      aria-labelledby='list-fields-preview-heading'
      className='min-h-80 p-4 md:p-5 lg:max-h-[75vh] lg:overflow-auto'
    >
      {/* Header */}
      <div className='border-b border-border pb-4'>
        <h6 className='hidden font-semibold tracking-wider text-accent lg:block'>
          Preview
        </h6>
        <p className='mt-1 text-sm text-muted-foreground'>
          A list preview will reflect the field setup.
        </p>
      </div>

      {/* List preview */}
      <div className='mt-4'>
        <Card query={previewCardQuery} isPreview />
      </div>
    </section>
  );
}

export default FieldsPreview;

type CardQuery = ComponentProps<typeof Card>['query'];

// Create preview card query helper
function createPreviewCardQuery(fields: ListFieldDraft[]): CardQuery {
  // List items collection
  const listValuesCollection = {
    edges: fields.map((field, index) => {
      const { config, value } = createPreviewData(field);
      return {
        node: makeFragmentData(
          {
            id: `preview-value-${field.id}`,
            value,
            list_fields: {
              id: field.id,
              type: field.type,
              config,
              position: index + 1,
            },
          } as ListValuesFragment,
          ListValuesFragmentDoc,
        ),
      };
    }),
  };

  // Lists collection
  const listEdgeData = {
    node: {
      id: 'preview-list',
      position: 1,
      list_valuesCollection:
        listValuesCollection as ListFragment['node']['list_valuesCollection'],
    },
  } as ListFragment;

  const listEdge = makeFragmentData(
    listEdgeData,
    ListFragmentDoc,
  ) as ListsCollectionFragment['edges'][number];

  const listsCollection = makeFragmentData(
    {
      edges: [listEdge],
    } as ListsCollectionFragment,
    ListsCollectionFragmentDoc,
  );

  // Card Query
  return makeFragmentData(
    {
      node: {
        title: 'Preview card',
        position: 1,
        color: ColorPalette.first,
        listsCollection:
          listsCollection as CardFragment['node']['listsCollection'],
      },
    } as CardFragment,
    CardFragmentDoc,
  );
}
