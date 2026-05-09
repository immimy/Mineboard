'use client';

import { CaretLeftIcon, CaretRightIcon } from '@/icons/icons';
import { Button } from '@headlessui/react';
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
type EmblaCarouselType = UseEmblaCarouselType[1];

type CarouselProps = {
  responsiveMaxWidth: string; // defining max width to prevent content overflow
  isSnapHidden?: boolean;
};

function Carousel({
  children,
  responsiveMaxWidth,
  isSnapHidden,
}: CarouselProps & React.PropsWithChildren) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
  });
  // Snap to the selected one
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedSnap, setSelectedSnap] = useState(0);

  const scrollTo = (index: number) => emblaApi?.scrollTo(index);
  const setupSnaps = (emblaApi: EmblaCarouselType) => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
  };
  const setActiveSnap = (emblaApi: EmblaCarouselType) => {
    if (!emblaApi) return;
    setSelectedSnap(emblaApi.selectedScrollSnap());
  };

  useEffect(() => {
    if (!emblaApi) return;

    setupSnaps(emblaApi);
    setActiveSnap(emblaApi);

    emblaApi.on('reInit', setupSnaps);
    emblaApi.on('reInit', setActiveSnap);
    emblaApi.on('select', setActiveSnap);
  }, [emblaApi]);

  return (
    <div className={clsx('mx-auto py-2', responsiveMaxWidth)}>
      {/* EMBLA__VIEWPORT */}
      <div ref={emblaRef} className='overflow-hidden mx-auto w-full mb-2.5'>
        {/* EMBLA__CONTAINER */}
        <div className='flex touch-pan-y touch-pinch-zoom'>
          {/* EMBLA__SLIDE */}
          {children}
        </div>
      </div>

      <div
        className={clsx(
          'px-1.5 mx-auto w-full flex items-center gap-4',
          isSnapHidden ? 'hidden' : 'block',
        )}
      >
        {/* BUTTONS */}
        <Button
          onClick={() => emblaApi?.scrollPrev()}
          className='order-first shrink-0 hover:cursor-pointer p-1.5 bg-neutral-foreground rounded-full'
        >
          <CaretLeftIcon className='stroke-neutral size-4.5 stroke-1' />
        </Button>
        <Button
          onClick={() => emblaApi?.scrollNext()}
          className='order-last shrink-0 hover:cursor-pointer p-1.5 bg-neutral-foreground rounded-full'
        >
          <CaretRightIcon className='stroke-neutral size-4.5 stroke-1' />
        </Button>
        {/* DOTS */}
        <div className='grow flex flex-wrap items-center justify-center gap-1.5'>
          {scrollSnaps.map((_, index) => (
            <Button
              key={index}
              className={`size-2.5 md:size-3 border-2 rounded-full text-border shadow hover:cursor-pointer dark:shadow-neutral-foreground ${index === selectedSnap ? 'opacity-100' : 'opacity-50'}`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default Carousel;
