import { getFieldTitle, ListFieldInputProps } from '../index';
import { mockPublicId } from '@/components/BoardPage/__tests__/singleBoardQuery.mock';

type ImageInputProps = {
  field: ListFieldInputProps['field'];
  form: object;
  handleFieldChange: (id: string, v: object) => void;
};

// Image input mock (Stub for Cloudinary)
// Simulate form state update of image field
function ImageInput({ field, form, handleFieldChange }: ImageInputProps) {
  return (
    <li style={{ order: field.position }}>
      <h6>{getFieldTitle(field)}</h6>
      <button
        type='button'
        data-testid='mock-image-input'
        onClick={() =>
          handleFieldChange(field.id, {
            ...form,
            value: [mockPublicId],
          })
        }
      >
        Mock Upload Image
      </button>
    </li>
  );
}
export default ImageInput;
