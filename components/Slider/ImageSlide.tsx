import { CldImage } from 'next-cloudinary';
import CarouselSlide from './CarouselSlide';
import Image from 'next/image';
import clsx from 'clsx';
import RemoveImageButton from './RemoveImageButton';

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

type ImageSlideProps = {
  image: string;
  index: number;
  className?: string;
  onRemove?: () => void;
};

function ImageSlide({ image, index, className, onRemove }: ImageSlideProps) {
  const loading = index ? 'lazy' : 'eager';
  let imageElement: React.ReactNode;

  // PRODUCTION: Cloudinary Image
  if (isProduction) {
    imageElement = (
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
    );
  } else if (!image.startsWith('https')) {
    // DEVELOPMENT with public Id: Cloudinary Image
    imageElement = (
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
    );
  } else {
    // DEVELOPMENT with seed data: Next Image
    imageElement = (
      <Image
        loading={loading}
        src={image}
        alt={image}
        width={288}
        height={220}
        className='w-full object-cover aspect-72/55'
      />
    );
  }

  return (
    <CarouselSlide
      key={image}
      className={clsx('relative overflow-hidden rounded-lg', className)}
    >
      {imageElement}
      {onRemove && <RemoveImageButton index={index} onRemove={onRemove} />}
    </CarouselSlide>
  );
}
export default ImageSlide;
