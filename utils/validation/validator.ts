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

// Recursively remove fields of object that contain empty string or undefined
// { title: '', isIncludeTime: true } --> { isIncludeTime: true }
// [{ title: '', color: 2 }] --> [{ color: 2 }]
function stripEmptyFields<T>(input: T): T {
  if (input === null || typeof input !== 'object') {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => stripEmptyFields(item)) as T;
  }

  return Object.fromEntries(
    Object.entries(input).flatMap(([key, value]) => {
      const output = stripEmptyFields(value);

      if (output === '' || output === undefined) return [];

      return [[key, output]];
    }),
  ) as T;
}

// ─── List_Value schemas ────────────────────────────────────────────

const textValueSchema = z.object({
  value: z.string().trim(),
});

const numberValueSchema = z.object({
  value: z
    .union([z.string().trim(), z.number()])
    .refine(
      (value) =>
        value === '' ||
        (typeof value === 'number'
          ? Number.isFinite(value)
          : Number.isFinite(Number(value))),
      'Invalid number value',
    )
    .transform((value) => {
      if (value === '') return value;
      return typeof value === 'number' ? value : Number(value);
    }),
});

const dateValueSchema = z
  .object({
    value: z
      .string()
      .trim()
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
  value: z
    .array(z.string().trim().optional())
    .max(5, 'You can upload up to 5 images'),
});

const checkboxValueSchema = z.object({
  value: z.object({
    checked: z.boolean(),
    title: z.string().trim(),
  }),
});

const tagValueSchema = z.object({
  value: z.array(
    z.object({
      tag: z.string().trim(),
      color: z
        .enum(ColorPalette, 'Color must be a valid palette value')
        .optional(),
    }),
  ),
});

const listValueSchema = z.discriminatedUnion('fieldType', [
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
export type ListValueInput = z.infer<typeof listValueSchema>;

// ─── List schema ────────────────────────────────────────────

export const createListSchema = z.object({
  cardId: z.uuid(),
  fieldValues: z.array(listValueSchema),
});

export const updateListSchema = z.object({
  listId: z.uuid(),
  fieldValues: z.array(listValueSchema),
});

// ─── Card schema ────────────────────────────────────────────

const cardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Card title is required')
    .max(30, 'Title must not exceed 30 characters'),
  color: z.preprocess(
    (value) => {
      const output = Number(value);
      if (typeof output === 'number' && !Number.isNaN(output)) return output;
      return value;
    },
    z.enum(ColorPalette, 'Color must be a valid palette value'),
  ),
});

export const createCardSchema = z.object({
  boardId: z.uuid(),
  ...cardSchema.shape,
});

export const updateCardSchema = z.object({
  cardId: z.uuid(),
  ...cardSchema.shape,
});

// ─── List_Field schemas ────────────────────────────────────────────

const listFieldIdSchema = z.union(
  [z.uuid(), z.string().startsWith('client:')],
  'List field id must be a database uuid or a client draft id',
);

export const listFieldSchema = z.discriminatedUnion('type', [
  z.object({
    id: listFieldIdSchema,
    type: z.literal(Field_Type.Text),
    config: z.object({
      title: z
        .string()
        .trim()
        .max(30, 'Field title must not exceed 30 characters')
        .optional(),
    }),
  }),
  z.object({
    id: listFieldIdSchema,
    type: z.literal(Field_Type.Number),
    config: z
      .object({
        title: z
          .string()
          .trim()
          .max(30, 'Field title must not exceed 30 characters')
          .optional(),
        isHasUnit: z.boolean(),
        unit: z
          .string()
          .trim()
          .max(20, 'Unit must not exceed 20 characters')
          .optional(),
        unitPosition: z.enum(['front', 'back']).optional(),
      })
      .refine(
        ({ isHasUnit, unit, unitPosition }) =>
          !isHasUnit || (Boolean(unit) && Boolean(unitPosition)),
        'Unit label is required.',
      )
      .transform(({ unit, unitPosition, ...config }) => {
        if (config.isHasUnit) return { ...config, unit, unitPosition };
        return { ...config };
      }),
  }),
  z.object({
    id: listFieldIdSchema,
    type: z.literal(Field_Type.Date),
    config: z.object({
      title: z
        .string()
        .trim()
        .max(30, 'Field title must not exceed 30 characters')
        .optional(),
      isIncludeTime: z.boolean(),
    }),
  }),
  z.object({
    id: listFieldIdSchema,
    type: z.literal(Field_Type.Image),
    config: z.object({
      title: z
        .string()
        .trim()
        .max(30, 'Field title must not exceed 30 characters')
        .optional(),
    }),
  }),
  z.object({
    id: listFieldIdSchema,
    type: z.literal(Field_Type.Checkbox),
    config: z.object({}),
  }),
  z.object({
    id: listFieldIdSchema,
    type: z.literal(Field_Type.Tag),
    config: z.object({
      color: z.preprocess(
        (value) => {
          const output = Number(value);
          if (typeof output === 'number' && !Number.isNaN(output)) {
            return output;
          }
          return value;
        },
        z.enum(ColorPalette, 'Color must be a valid palette value'),
      ),
    }),
  }),
]);

export const createListFieldsSchema = z.object({
  boardId: z.uuid(),
  fields: z
    .array(
      listFieldSchema.transform(({ id: _, ...config }) =>
        stripEmptyFields(config),
      ),
    )
    .min(1, 'Add at least one field before saving'),
});

export const updateListFieldsSchema = z.object({
  boardId: z.uuid(),
  fields: z
    .array(
      listFieldSchema.transform(({ id, ...field }) => ({
        id: id.startsWith('client:') ? '' : id,
        ...stripEmptyFields(field),
      })),
    )
    .min(1, 'Add at least one field before saving'),
  deletedFieldIds: z.array(z.uuid()),
});

// ─── Board schema ────────────────────────────────────────────

const boardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Board title is required')
    .max(30, 'Title must not exceed 30 characters'),
});

export const createBoardSchema = boardSchema;

export const updateBoardTitleSchema = z.object({
  boardId: z.uuid(),
  ...boardSchema.shape,
});
