import { TextSchema } from '@/types/jsonbSchema';
import { ListFieldProps } from '.';

function TextField({ data, position }: ListFieldProps<TextSchema>) {
  const {
    config: { title },
    value,
  } = data;

  return (
    <li style={{ order: position }}>
      {title && (
        <h6 className='border-b border-border font-semibold'>{title}</h6>
      )}
      <p>{value}</p>
    </li>
  );
}
export default TextField;
