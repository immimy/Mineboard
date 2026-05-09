import { ColorPalette, TagSchema } from '@/types/jsonbSchema';
import { ListFieldProps } from '.';

function getDynamicCSS(color: ColorPalette) {
  return {
    tagCSS: `bg-card-${color}/80 text-card-light-${color} dark:bg-card-${color}/90`,
  };
}

function TagField({ data, position }: ListFieldProps<TagSchema>) {
  const {
    config: { color },
    value,
  } = data;

  return (
    <li
      className='flex items-center gap-2 justify-end'
      style={{ order: position }}
    >
      {value.map((item) => {
        const dynamicCSS = getDynamicCSS(item.color ?? color);
        return (
          <span
            key={item.tag}
            className={`${dynamicCSS.tagCSS} rounded-xl px-2.5 py-0.5 shadow-xs text-sm tracking-wider`}
          >
            {item.tag}
          </span>
        );
      })}
    </li>
  );
}
export default TagField;
