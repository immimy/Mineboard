import { CldImage } from 'next-cloudinary';
import CarouselSlide from './CarouselSlide';
import Image from 'next/image';
import clsx from 'clsx';

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

type ImageSlideProps = { image: string; index: number; className?: string };

function ImageSlide({ image, index, className }: ImageSlideProps) {
  const loading = index ? 'lazy' : 'eager';

  // PRODUCTION: Cloudinary Image
  if (isProduction) {
    return (
      <CarouselSlide key={image} className={clsx(className)}>
        <CldImage
          loading={loading}
          src={image}
          alt={image}
          width={288}
          height={220}
          className='w-full object-cover aspect-72/55'
          crop='auto'
          gravity='auto'
        />
      </CarouselSlide>
    );
  }

  // DEVELOPMENT with public Id: Cloudinary Image
  if (!image.startsWith('https')) {
    return (
      <CarouselSlide key={image} className={clsx(className)}>
        <CldImage
          loading={loading}
          src={image}
          alt={image}
          width={288}
          height={220}
          className='w-full object-cover aspect-72/55'
          crop='auto'
          gravity='auto'
        />
      </CarouselSlide>
    );
  }

  // DEVELOPMENT with seed data: Next Image
  return (
    <CarouselSlide key={image} className={clsx(className)}>
      <Image
        loading={loading}
        src={image}
        alt={image}
        width={288}
        height={220}
        className='w-full object-cover aspect-72/55'
      />
    </CarouselSlide>
  );
}
export default ImageSlide;
