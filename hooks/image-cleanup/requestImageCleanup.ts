import type { ImageCleanupInput } from '@/utils/validation/validator';
import { toast } from 'react-toastify';

/**
 * Starts best-effort server cleanup without keeping the list dialog open.
 * Failed work keeps the `unsaved` tag and is retried by scheduled cleanup.
 */
function requestImageCleanup(input: ImageCleanupInput) {
  // Guards empty image ids
  if (
    !input.discardedIds.length &&
    (input.case === 'cancelled' || !input.savedIds.length)
  )
    return;

  // Dynamic imports and calls the cleanup action without waiting for a result
  void import('@/utils/actions/imageCleanup')
    .then(({ imageCleanup }) => imageCleanup(input))
    .then(({ error }) => {
      if (error && process.env.NODE_ENV === 'development') toast.error(error);
    })
    .catch((error) => {
      console.error('Failed to request Cloudinary image cleanup', error);
    });
}

export default requestImageCleanup;
