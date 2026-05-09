import { NumberSchema } from '@/types/jsonbSchema';
import { ListFieldProps } from '.';

function NumberField({ data, position }: ListFieldProps<NumberSchema>) {
  const {
    config: { title, isHasUnit, unit, unitPosition },
    value,
  } = data;

  return (
    <li className='flex items-center gap-2' style={{ order: position }}>
      {title && <h6 className='font-semibold'>{title} :</h6>}
      <div className='flex gap-2'>
        <p className='order-2'>{Number(value).toFixed(2)}</p>
        {isHasUnit && (
          <p
            className={`${unitPosition === 'front' ? 'order-1' : 'order-3'} font-medium`}
          >
            {unit}
          </p>
        )}
      </div>
    </li>
  );
}
export default NumberField;
