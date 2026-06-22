import Image from 'next/image';
import { ListFieldProps } from '.';
import { ImageSchema } from '@/types/jsonbSchema';
import Carousel from '../Slider/Carousel';
import CarouselSlide from '../Slider/CarouselSlide';
import { CldImage } from 'next-cloudinary';
import { ImageIcon } from '@/icons/icons';

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

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
            const loading = index === 0 ? 'eager' : 'lazy';

            // PRODUCTION: Cloudinary Image
            if (isProduction) {
              return (
                <CarouselSlide key={image}>
                  <CldImage
                    loading={loading}
                    src={image}
                    alt={image}
                    width={288}
                    height={220}
                    className='w-72 h-55'
                    crop='auto'
                    gravity='auto'
                  />
                </CarouselSlide>
              );
            }

            // DEVELOPMENT with public Id: Cloudinary Image
            if (!image.startsWith('https')) {
              return (
                <CarouselSlide key={image}>
                  <CldImage
                    loading={loading}
                    src={image}
                    alt={image}
                    width={288}
                    height={220}
                    className='w-72 h-55'
                    crop='auto'
                    gravity='auto'
                  />
                </CarouselSlide>
              );
            }

            // DEVELOPMENT with seed data: Next Image
            return (
              <CarouselSlide key={image}>
                <Image
                  loading={loading}
                  src={image}
                  alt={image}
                  width={288}
                  height={220}
                  className='w-72 h-55'
                />
              </CarouselSlide>
            );
          })}
        </Carousel>
      )}
    </li>
  );
}
export default ImageField;
