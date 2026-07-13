import { ListFieldProps } from '.';
import { ImageSchema } from '@/types/jsonbSchema';
import Carousel from '../Slider/Carousel';
import { ImageIcon } from '@/icons/icons';
import ImageSlide from '../Slider/ImageSlide';

function ImageField({ data, position }: ListFieldProps<ImageSchema>) {
  const {
    config: { title },
    value,
  } = data;

  return (
    <li style={{ order: position }}>
      {title && (
        <h6 className='border-b border-border font-semibold'>{title}</h6>
      )}
      {!value.length ? (
        <div
          role='img'
          aria-label={`${title || 'Image'} placeholder`}
          className='mx-auto my-2 grid h-55 w-72 max-w-full place-items-center rounded border border-dashed border-border bg-muted/30 text-muted-foreground'
        >
          <ImageIcon className='size-10' />
        </div>
      ) : (
        <Carousel
          responsiveMaxWidth='max-w-2xs sm:max-w-md md:max-w-2xs'
          isSnapHidden={value.length <= 1}
        >
          {value.map((image, index) => {
            return <ImageSlide key={image} image={image} index={index} />;
          })}
        </Carousel>
      )}
    </li>
  );
}
export default ImageField;
