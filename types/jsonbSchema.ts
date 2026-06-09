/** Color Palette */

import { Field_Type } from '@/gql/__generated__/graphql';

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
// Define all jsonb structures here in the app layer

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

type TextConfig = { title: string };
type TextValue = string;
type TextMeta = Record<string, never>;

export type TextSchema = JsonbSchemaBase<TextConfig, TextValue>;
export type TextInput = JsonbInputBase<Field_Type.Text, TextValue, TextMeta>;

/** Number */

type UnitConfig = {
  isHasUnit: boolean;
  unit: string;
  unitPosition: 'front' | 'back';
};
type NumberConfig = { title: string } & UnitConfig;
type NumberValue = string;
type NumberMeta = Record<string, never>;

export type NumberSchema = JsonbSchemaBase<NumberConfig, NumberValue>;
export type NumberInput = JsonbInputBase<
  Field_Type.Number,
  NumberValue,
  NumberMeta
>;

/** Date */

type DateConfig = { title: string; isIncludeTime: boolean };
type DateValue = string;
type DateMeta = { meta: { tzOffset: number } };

export type DateSchema = JsonbSchemaBase<DateConfig, DateValue>;
export type DateInput = JsonbInputBase<Field_Type.Date, DateValue, DateMeta>;

/** Image */

type ImageConfig = { title: string };
type ImageValue = string[];
type ImageMeta = Record<string, never>;

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

export type TagSchema = JsonbSchemaBase<TagConfig, TagValue>;
export type TagInput = JsonbInputBase<Field_Type.Tag, TagValue, TagMeta>;

/** All List Field Types */

export type ListField =
  | TextSchema
  | NumberSchema
  | DateSchema
  | ImageSchema
  | CheckboxSchema
  | TagSchema;

export type ListFieldInput =
  | TextInput
  | NumberInput
  | DateInput
  | ImageInput
  | CheckboxInput
  | TagInput;
