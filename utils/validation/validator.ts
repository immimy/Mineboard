import { ColorPalette } from '@/types/jsonbSchema';
import { z, ZodType } from 'zod';
import { localDateToUTC } from '../formatter/helper';
import { Field_Type } from '@/gql/__generated__/graphql';

export function validateWithZodSchema<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = z.flattenError(result.error);
    const fieldErrors = Object.values(errors.fieldErrors).flat();
    const formErrors = errors.formErrors;
    const errorMessages = [...fieldErrors, ...formErrors].join(', ');
    throw new Error(errorMessages);
  }
  return result.data;
}

// ─── List_Value schemas ────────────────────────────────────────────

const textValueSchema = z.object({
  value: z.string(),
});

const numberValueSchema = z.object({
  value: z
    .string()
    .refine((value) => value === '' || !Number.isNaN(value))
    .transform((value) => {
      if (value === '') return value;
      return Number(value);
    }),
});

const dateValueSchema = z
  .object({
    value: z
      .string()
      .refine(
        (value) => value.length === 0 || !Number.isNaN(Date.parse(value)),
        'Invalid date value',
      ),
    meta: z.object({ tzOffset: z.number('Timezone offset must be provided') }),
  })
  .transform((field) => {
    if (field.value.length === 0) return { value: field.value };
    return { value: localDateToUTC(field.value, field.meta.tzOffset) };
  });

const imageValueSchema = z.object({
  value: z.array(z.string().optional()).max(5, 'You can upload up to 5 images'),
});

const checkboxValueSchema = z.object({
  value: z.object({
    checked: z.boolean(),
    title: z.string(),
  }),
});

const tagValueSchema = z.object({
  value: z.array(
    z.object({
      tag: z.string(),
      color: z
        .enum(ColorPalette, 'Color must be a valid palette value')
        .optional(),
    }),
  ),
});

export const listValueInputSchema = z.discriminatedUnion('fieldType', [
  z.object({
    listFieldId: z.uuid(),
    fieldType: z.literal(Field_Type.Text),
    input: textValueSchema,
  }),
  z.object({
    listFieldId: z.uuid(),
    fieldType: z.literal(Field_Type.Number),
    input: numberValueSchema,
  }),
  z.object({
    listFieldId: z.uuid(),
    fieldType: z.literal(Field_Type.Date),
    input: dateValueSchema,
  }),
  z.object({
    listFieldId: z.uuid(),
    fieldType: z.literal(Field_Type.Image),
    input: imageValueSchema,
  }),
  z.object({
    listFieldId: z.uuid(),
    fieldType: z.literal(Field_Type.Checkbox),
    input: checkboxValueSchema,
  }),
  z.object({
    listFieldId: z.uuid(),
    fieldType: z.literal(Field_Type.Tag),
    input: tagValueSchema,
  }),
]);
export type ListValueInput = z.infer<typeof listValueInputSchema>;

export const createListSchema = z.object({
  cardId: z.uuid(),
  fieldValues: z.array(listValueInputSchema),
});
