import clsx from 'clsx';

type CarouselSlideProps = React.PropsWithChildren<{
  className?: string;
}>;

function CarouselSlide({ children, className }: CarouselSlideProps) {
  return (
    <figure className={clsx('shrink-0 basis-full min-w-0', className)}>
      {children}
    </figure>
  );
}
export default CarouselSlide;
