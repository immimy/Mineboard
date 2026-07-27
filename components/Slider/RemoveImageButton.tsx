import { Button } from '@headlessui/react';
import { XIcon } from '@/icons/icons';

type RemoveImageButtonProps = {
  index: number;
  onRemove: () => void;
};

function RemoveImageButton({ index, onRemove }: RemoveImageButtonProps) {
  return (
    <Button
      type='button'
      aria-label={`Remove image ${index + 1}`}
      onClick={onRemove}
      className='group absolute right-2 top-2 z-10 grid size-6 place-items-center rounded hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
    >
      <XIcon className='size-5 stroke-2 stroke-muted group-hover:stroke-destructive drop-shadow-sm drop-shadow-border/50' />
    </Button>
  );
}

export default RemoveImageButton;
