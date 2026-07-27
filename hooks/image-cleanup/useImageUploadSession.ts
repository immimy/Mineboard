import { Field_Type } from '@/gql/__generated__/graphql';
import { ListForm } from '@/types/app';
import { useCallback, useRef } from 'react';

export type ImageUploadSessionResult = {
  savedIds: string[]; // remove unsaved tag
  discardedIds: string[]; // queue image for deletion
};

// Get all image ids that will be stored in the database
function getSubmittedImageIds(form: ListForm) {
  return new Set(
    Object.values(form).flatMap((field) =>
      field.type === Field_Type.Image ? field.value : [],
    ),
  );
}

/**
 * Tracks Cloudinary uploads created while one list dialog is open.
 *
 * The returned ID batches are the client boundary for the future server-side
 * cleanup and tag-finalization actions.
 */
function useImageUploadSession() {
  const uploadedIdsRef = useRef(new Set<string>());

  const trackUpload = useCallback((publicId: string) => {
    uploadedIdsRef.current.add(publicId);
  }, []);

  const discardSession = useCallback((): string[] => {
    const discardedIds = [...uploadedIdsRef.current];
    uploadedIdsRef.current.clear();
    return discardedIds;
  }, []);

  const completeSession = useCallback(
    (form: ListForm): ImageUploadSessionResult => {
      const submittedIds = getSubmittedImageIds(form);
      const result: ImageUploadSessionResult = {
        savedIds: [],
        discardedIds: [],
      };

      uploadedIdsRef.current.forEach((publicId) => {
        const destination = submittedIds.has(publicId)
          ? result.savedIds
          : result.discardedIds;
        destination.push(publicId);
      });

      uploadedIdsRef.current.clear();
      return result;
    },
    [],
  );

  return { trackUpload, discardSession, completeSession };
}

export default useImageUploadSession;
