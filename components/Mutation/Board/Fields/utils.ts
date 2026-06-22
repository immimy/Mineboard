import { Field_Type } from '@/gql/__generated__/graphql';
import { ColorPalette, ListField, ListFieldDraft } from '@/types/jsonbSchema';

// Create field draft for FieldsForm state
export function createFieldDraft(
  type: Field_Type,
  id = crypto.randomUUID(),
): ListFieldDraft {
  switch (type) {
    case Field_Type.Checkbox:
      return { id, type, config: {} };
    case Field_Type.Date:
      return {
        id,
        type,
        config: { title: '', isIncludeTime: false },
      };
    case Field_Type.Image:
      return { id, type, config: { title: '' } };
    case Field_Type.Number:
      return {
        id,
        type,
        config: {
          title: '',
          isHasUnit: false,
          unit: '',
          unitPosition: 'front',
        },
      };
    case Field_Type.Tag:
      return { id, type, config: { color: ColorPalette.first } };
    case Field_Type.Text:
      return { id, type, config: { title: '' } };
  }
}

// Create preview data for FieldsPreview
export function createPreviewData(field: ListFieldDraft): ListField {
  switch (field.type) {
    case Field_Type.Checkbox:
      return {
        config: field.config,
        value: { checked: true, title: 'checklist' },
      };
    case Field_Type.Date:
      return {
        config: field.config,
        value: field.config.isIncludeTime ? '2025-12-25T12:00Z' : '2025-12-25',
      };
    case Field_Type.Image:
      return {
        config: field.config,
        value: [],
      };
    case Field_Type.Number:
      return {
        config: field.config,
        value: '100',
      };
    case Field_Type.Tag:
      return {
        config: field.config,
        value: [{ tag: 'example' }],
      };
    case Field_Type.Text:
      return {
        config: field.config,
        value: 'Short note preview for this list item.',
      };
  }
}
