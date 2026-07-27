import { ImageInput as ImageForm } from '@/types/jsonbSchema';
import { getFieldTitle, ListFieldInputProps } from '.';
import { Button } from '@headlessui/react';
import {
  CldUploadWidget,
  CldUploadWidgetProps,
  CloudinaryUploadWidgetInfo,
} from 'next-cloudinary';
import Carousel from '@/components/Slider/Carousel';
import { toast } from 'react-toastify';
import { ImageDownIcon } from '@/icons/icons';
import { useRef } from 'react';
import clsx from 'clsx';
import { useFormStatus } from 'react-dom';
import ImageSlide from '@/components/Slider/ImageSlide';

const maxFiles = 5;
const uploadPreset =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'mineboard_app'
    : 'mineboard_app_dev';

function ImageInput({
  field,
  form,
  ownerId,
  handleFieldChange,
  handleImageUpload,
}: Omit<ListFieldInputProps, 'form'> & { form: ImageForm }) {
  const { pending } = useFormStatus();
  // Temporary reference while the Cloudinary widget opens
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

  // Handle error on the Cloudinary image upload
  const handleError: CldUploadWidgetProps['onError'] = (error) => {
    if (!error) return;
    const errorMessage =
      typeof error === 'string'
        ? 'Failed to upload an image'
        : error.statusText;
    toast.error(errorMessage || 'Failed to upload an image');
  };

  // Handle success on the Cloudinary image upload
  const handleSuccess: CldUploadWidgetProps['onSuccess'] = (results) => {
    const publicId = (results.info as CloudinaryUploadWidgetInfo).public_id;
    if (!publicId) return;
    // Add new image to the temporary reference
    imagesRef.current = [...imagesRef.current, publicId];
    // Track uploaded image to the image upload session
    handleImageUpload?.(publicId);
  };

  // Remove the selected image from the the form state
  const handleRemove = (publicId: string) => {
    handleFieldChange(field.id, {
      ...form,
      value: form.value.filter((image) => image !== publicId),
    });
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
        uploadPreset={uploadPreset}
        signatureEndpoint='/api/sign-cloudinary'
        options={{
          sources: ['local'],
          multiple: true,
          maxFiles: available > 0 ? available : -1,
          maxFileSize: 0.5 * 1024 * 1024, // 0.5 MB
          resourceType: 'image',
          context: ownerId ? { owner_id: ownerId } : undefined,
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
                disabled={numOfFiles >= maxFiles || pending}
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
        <Carousel
          responsiveMaxWidth='max-w-2xs sm:max-w-md md:max-w-3xl'
          isSnapHidden={numOfFiles <= 1}
        >
          {form.value.map((image, index) => {
            return (
              <ImageSlide
                key={image}
                image={image}
                index={index}
                className='md:basis-auto'
                onRemove={() => handleRemove(image)}
              />
            );
          })}
        </Carousel>
      )}
    </li>
  );
}

export default ImageInput;
