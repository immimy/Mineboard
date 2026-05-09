import { Field_Type } from '@/gql/__generated__/graphql';
import { getFieldTitle } from '../index';
import { mockPublicId } from '@/components/Board/__tests__/singleBoardQuery.mock';

type ImageInputProps = {
  field: {
    id: string;
    config: { title: string };
    type: Field_Type.Image;
    position: number;
  };
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
