function CarouselSlide({ children }: React.PropsWithChildren) {
  return (
    <figure className='grow-0 shrink-0 basis-72 min-w-0'>{children}</figure>
  );
}
export default CarouselSlide;
