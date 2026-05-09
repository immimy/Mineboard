import Image from 'next/image';
import { ListFieldProps } from '.';
import { ImageSchema } from '@/types/jsonbSchema';
import Carousel from '../Slider/Carousel';
import CarouselSlide from '../Slider/CarouselSlide';
import { CldImage } from 'next-cloudinary';

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
      <Carousel
        responsiveMaxWidth='max-w-2xs sm:max-w-md md:max-w-2xs'
        isSnapHidden={value.length <= 1}
      >
        {value.map((image) => {
          // PRODUCTION: Cloudinary Image
          if (isProduction) {
            return (
              <CarouselSlide key={image}>
                <CldImage
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
    </li>
  );
}
export default ImageField;
