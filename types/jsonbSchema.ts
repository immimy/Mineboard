import { Field_Type } from '@/gql/__generated__/graphql';

/** Color Palette */

// Refer from CSS file
export enum ColorPalette {
  first = 1,
  second = 2,
  third = 3,
  fourth = 4,
  fifth = 5,
  sixth = 6,
  seventh = 7,
  eighth = 8,
  ninth = 9,
}
export const colorOptions = [
  ColorPalette.first,
  ColorPalette.second,
  ColorPalette.third,
  ColorPalette.fourth,
  ColorPalette.fifth,
  ColorPalette.sixth,
  ColorPalette.seventh,
  ColorPalette.eighth,
  ColorPalette.ninth,
];

/** list_fields table */

export const fieldTypeOptions = [
  Field_Type.Text,
  Field_Type.Number,
  Field_Type.Date,
  Field_Type.Image,
  Field_Type.Checkbox,
  Field_Type.Tag,
];

// Define all jsonb structures here in the app layer

type FieldBase<TType, TConfig> = {
  id: string;
  type: TType;
  config: TConfig;
};

type JsonbSchemaBase<TConfig, TValue> = {
  config: TConfig;
  value: TValue;
};

type JsonbInputBase<TType, TValue, TMeta> = {
  type: TType;
  value: TValue;
  meta?: TMeta;
};

/** Text */

type TextConfig = { title?: string };
type TextValue = string;
type TextMeta = Record<string, never>;

export type TextField = FieldBase<Field_Type.Text, TextConfig>;
export type TextSchema = JsonbSchemaBase<TextConfig, TextValue>;
export type TextInput = JsonbInputBase<Field_Type.Text, TextValue, TextMeta>;

/** Number */

type UnitConfig = {
  isHasUnit: boolean;
  unit: string;
  unitPosition: 'front' | 'back';
};
type NumberConfig = { title?: string } & UnitConfig;
type NumberValue = string;
type NumberMeta = Record<string, never>;

export type NumberField = FieldBase<Field_Type.Number, NumberConfig>;
export type NumberSchema = JsonbSchemaBase<NumberConfig, NumberValue>;
export type NumberInput = JsonbInputBase<
  Field_Type.Number,
  NumberValue,
  NumberMeta
>;

/** Date */

type DateConfig = { title?: string; isIncludeTime: boolean };
type DateValue = string;
type DateMeta = { meta: { tzOffset: number } };

export type DateField = FieldBase<Field_Type.Date, DateConfig>;
export type DateSchema = JsonbSchemaBase<DateConfig, DateValue>;
export type DateInput = JsonbInputBase<Field_Type.Date, DateValue, DateMeta>;

/** Image */

type ImageConfig = { title?: string };
type ImageValue = string[];
type ImageMeta = Record<string, never>;

export type ImageField = FieldBase<Field_Type.Image, ImageConfig>;
export type ImageSchema = JsonbSchemaBase<ImageConfig, ImageValue>;
export type ImageInput = JsonbInputBase<
  Field_Type.Image,
  ImageValue,
  ImageMeta
>;

/** Checkbox */

type CheckboxConfig = Record<string, never>;
type CheckboxValue = { checked: boolean; title: string };
type CheckboxMeta = Record<string, never>;

export type CheckboxField = FieldBase<Field_Type.Checkbox, CheckboxConfig>;
export type CheckboxSchema = JsonbSchemaBase<CheckboxConfig, CheckboxValue>;
export type CheckboxInput = JsonbInputBase<
  Field_Type.Checkbox,
  CheckboxValue,
  CheckboxMeta
>;

/** Tag */

type TagConfig = { color: ColorPalette };
type TagValue = { tag: string; color?: ColorPalette }[];
type TagMeta = Record<string, never>;

export type TagField = FieldBase<Field_Type.Tag, TagConfig>;
export type TagSchema = JsonbSchemaBase<TagConfig, TagValue>;
export type TagInput = JsonbInputBase<Field_Type.Tag, TagValue, TagMeta>;

/** All List Field Types */

// Define list fields for a single board
export type ListFieldDraft =
  | TextField
  | NumberField
  | DateField
  | ImageField
  | CheckboxField
  | TagField;

// Render list fields in the list
export type ListField =
  | TextSchema
  | NumberSchema
  | DateSchema
  | ImageSchema
  | CheckboxSchema
  | TagSchema;

// Create/Update list
export type ListFieldInput =
  | TextInput
  | NumberInput
  | DateInput
  | ImageInput
  | CheckboxInput
  | TagInput;

// Update list
export type ListFieldValue =
  | TextValue
  | NumberValue
  | DateValue
  | ImageValue
  | CheckboxValue
  | TagValue;
