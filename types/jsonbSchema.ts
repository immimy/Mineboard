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

/**** list_fields ****/
// Define all jsonb structures here in the app layer

type JsonbSchemaBase<TConfig, TValue> = {
  config: TConfig;
  value: TValue;
};

/** Text */
type TextConfig = { title: string };
export type TextSchema = JsonbSchemaBase<TextConfig, string>;

/** Number */
type UnitConfig = {
  isHasUnit: boolean;
  unit: string;
  unitPosition: 'front' | 'back';
};
type NumberConfig = { title: string } & UnitConfig;
export type NumberSchema = JsonbSchemaBase<NumberConfig, string>;

/** Date */
type DateConfig = { title: string; isIncludeTime: boolean };
export type DateSchema = JsonbSchemaBase<DateConfig, string>;
export type DateInputSchema = DateSchema & {
  meta: { tzOffset: number };
};

/** Image */
type ImageConfig = { title: string };
export type ImageSchema = JsonbSchemaBase<ImageConfig, string[]>;

/** Checkbox */
type CheckboxValue = { checked: boolean; title: string };
export type CheckboxSchema = JsonbSchemaBase<Record<string, never>, CheckboxValue>;

/** Tag */
type TagValue = { tag: string; color?: ColorPalette };
export type TagSchema = JsonbSchemaBase<{ color: ColorPalette }, TagValue[]>;

/** All List Field Types */
export type ListField =
  | TextSchema
  | NumberSchema
  | DateSchema
  | ImageSchema
  | CheckboxSchema
  | TagSchema;
