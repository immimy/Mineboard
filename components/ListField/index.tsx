import { Field_Type } from '@/gql/__generated__/graphql';
import TextField from '../ListField/TextField';
import CheckboxField from '../ListField/CheckboxField';
import DateField from '../ListField/DateField';
import ImageField from '../ListField/ImageField';
import NumberField from '../ListField/NumberField';
import TagField from '../ListField/TagField';
import {
  CheckboxSchema,
  DateSchema,
  ImageSchema,
  ListField,
  NumberSchema,
  TagSchema,
  TextSchema,
} from '@/types/jsonbSchema';

export type ListFieldProps<TValue> = { data: TValue; position: number };

export default function renderListField(
  key: string,
  type: Field_Type,
  data: ListField,
  position: number,
) {
  switch (type) {
    case Field_Type.Checkbox:
      return (
        <CheckboxField
          key={key}
          data={data as CheckboxSchema}
          position={position}
        />
      );
    case Field_Type.Date:
      return (
        <DateField key={key} data={data as DateSchema} position={position} />
      );
    case Field_Type.Image:
      return (
        <ImageField key={key} data={data as ImageSchema} position={position} />
      );
    case Field_Type.Number:
      return (
        <NumberField
          key={key}
          data={data as NumberSchema}
          position={position}
        />
      );
    case Field_Type.Tag:
      return (
        <TagField key={key} data={data as TagSchema} position={position} />
      );
    case Field_Type.Text:
      return (
        <TextField key={key} data={data as TextSchema} position={position} />
      );
  }
}
