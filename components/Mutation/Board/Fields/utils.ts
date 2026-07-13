import { Field_Type } from '@/gql/__generated__/graphql';
import { ListFieldForm } from '@/types/app';
import {
  CheckboxSchema,
  ColorPalette,
  DateSchema,
  ImageSchema,
  ListField,
  ListFieldDraft,
  NumberSchema,
  TagSchema,
  TextSchema,
} from '@/types/jsonbSchema';

// Create field draft for FieldsForm state
export function createFieldDraft({
  id = `client:${crypto.randomUUID()}`,
  type,
  position,
  config,
}: {
  id?: string;
  type: Field_Type;
  position: number;
  config?: ListFieldDraft['config'];
}): ListFieldForm {
  const initial = { id, position };
  switch (type) {
    case Field_Type.Checkbox:
      return {
        ...initial,
        type,
        config: (config as CheckboxSchema['config']) ?? {},
      };
    case Field_Type.Date:
      return {
        ...initial,
        type,
        config: (config as DateSchema['config']) ?? {
          title: '',
          isIncludeTime: false,
        },
      };
    case Field_Type.Image:
      return {
        ...initial,
        type,
        config: (config as ImageSchema['config']) ?? { title: '' },
      };
    case Field_Type.Number:
      return {
        ...initial,
        type,
        config: (config as NumberSchema['config']) ?? {
          title: '',
          isHasUnit: false,
          unit: '',
          unitPosition: 'front',
        },
      };
    case Field_Type.Tag:
      return {
        ...initial,
        type,
        config: (config as TagSchema['config']) ?? {
          color: ColorPalette.first,
        },
      };
    case Field_Type.Text:
      return {
        ...initial,
        type,
        config: (config as TextSchema['config']) ?? { title: '' },
      };
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
