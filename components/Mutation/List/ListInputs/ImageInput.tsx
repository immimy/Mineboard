import { ImageSchema } from '@/types/jsonbSchema';
import { getFieldTitle, ListFieldInputProps } from '.';
import { ListFieldData } from '@/types/app';
import { Button } from '@headlessui/react';
import {
  CldImage,
  CldUploadWidget,
  CldUploadWidgetProps,
  CloudinaryUploadWidgetInfo,
} from 'next-cloudinary';
import Carousel from '@/components/Slider/Carousel';
import { toast } from 'react-toastify';
import { ImageDownIcon } from '@/icons/icons';
import { useRef } from 'react';
import clsx from 'clsx';
import CarouselSlide from '@/components/Slider/CarouselSlide';

const maxFiles = 5;
const tags =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? ['unsaved']
    : ['unsaved', 'dev'];

function ImageInput({
  field,
  form,
  handleFieldChange,
}: Omit<ListFieldInputProps, 'form'> & { form: ListFieldData<ImageSchema> }) {
  const imagesRef = useRef<string[]>([]);

  // Total current files and the remaining quota left for uploads
  const numOfFiles = form.value.length;
  const available = maxFiles - numOfFiles;

  // Update form state when user closing the widget
  const handleClose: CldUploadWidgetProps['onClose'] = () => {
    const publicIds = [...imagesRef.current];
    if (!publicIds.length) return;
    handleFieldChange(field.id, {
      ...form,
      value: [...form.value, ...publicIds],
    });
    imagesRef.current = [];
  };

  const handleError: CldUploadWidgetProps['onError'] = (error) => {
    if (!error) return;
    const errorMessage =
      typeof error === 'string'
        ? 'Failed to upload an image'
        : error.statusText;
    toast.error(errorMessage || 'Failed to upload an image');
  };

  const handleSuccess: CldUploadWidgetProps['onSuccess'] = (results) => {
    const publicId = (results.info as CloudinaryUploadWidgetInfo).public_id;
    imagesRef.current = [...imagesRef.current, publicId];
  };

  return (
    <li style={{ order: field.position }} className='md:flex md:flex-col'>
      {/* TITLE */}
      <h6 className='text-sm font-semibold block mb-2 border-b border-border'>
        {getFieldTitle(field)}
      </h6>
      {/* CLOUDINARY WIDGET */}
      <CldUploadWidget
        key={`${field.id}-${numOfFiles}`}
        uploadPreset='mineboard_app'
        signatureEndpoint='/api/sign-cloudinary'
        options={{
          sources: ['local'],
          multiple: true,
          maxFiles: available > 0 ? available : -1,
          maxFileSize: 0.5 * 1024 * 1024, // 0.5 MB
          resourceType: 'image',
          tags,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        }}
        onSuccess={handleSuccess}
        onError={handleError}
        onClose={handleClose}
      >
        {({ open, hide }) => {
          return (
            <div className='self-end mb-2 md:flex md:items-center md:gap-1.5'>
              <div className='text-center'>
                <span
                  className={clsx(
                    'text-sm font-medium capitalize',
                    available ? 'text-warning' : 'text-destructive',
                  )}
                >
                  {available ? `${available} remaining` : 'out of limits'}
                </span>
                <span className='ml-2.5 text-sm font-medium text-muted-foreground'>
                  Max Size: 0.5 MB
                </span>
              </div>
              <Button
                disabled={numOfFiles >= maxFiles}
                onClick={() => {
                  if (available <= 0) return hide();
                  open();
                }}
                className='px-6 py-2 rounded-lg text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:cursor-pointer disabled:cursor-not-allowed uppercase text-xs font-medium tracking-tight w-full md:w-auto'
              >
                <ImageDownIcon className='inline mr-1.5' />
                Upload Image
              </Button>
            </div>
          );
        }}
      </CldUploadWidget>
      {/* IMAGE PREVIEW */}
      {numOfFiles > 0 && (
        <Carousel responsiveMaxWidth='max-w-2xs sm:max-w-md md:max-w-lg lg:max-w-3xl'>
          {form.value.map((image) => {
            return (
              <CarouselSlide key={image}>
                <CldImage
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

export default ImageInput;
