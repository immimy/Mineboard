import { formatDate } from '@/utils/formatter/helper';
import { ListFieldProps } from '.';
import { DateSchema } from '@/types/jsonbSchema';

function DateField({ data, position }: ListFieldProps<DateSchema>) {
  const {
    config: { title, isIncludeTime },
    value,
  } = data;

  return (
    <li
      className='flex items-center justify-end flex-wrap gap-2'
      style={{ order: position }}
    >
      {title && <h6 className='font-semibold'>{title} :</h6>}
      <p>{formatDate(value, isIncludeTime)}</p>
    </li>
  );
}
export default DateField;
