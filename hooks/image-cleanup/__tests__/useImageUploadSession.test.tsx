import useImageUploadSession, {
  type ImageUploadSessionResult,
} from '../useImageUploadSession';
import { Field_Type } from '@/gql/__generated__/graphql';
import { ListForm } from '@/types/app';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';

const submittedForm: ListForm = {
  imageField: {
    type: Field_Type.Image,
    value: ['saved-image'],
  },
  textField: {
    type: Field_Type.Text,
    value: 'A non-image value is ignored.',
  },
};

function ImageUploadSessionHarness({
  onComplete,
  onDiscard,
}: {
  onComplete: (result: ImageUploadSessionResult) => void;
  onDiscard: (discardedIds: string[]) => void;
}) {
  const { completeSession, discardSession, trackUpload } =
    useImageUploadSession();

  return (
    <>
      <button onClick={() => trackUpload('saved-image')}>Track saved</button>
      <button onClick={() => trackUpload('removed-image')}>
        Track removed
      </button>
      <button onClick={() => onComplete(completeSession(submittedForm))}>
        Complete session
      </button>
      <button onClick={() => onDiscard(discardSession())}>
        Discard session
      </button>
    </>
  );
}

describe('useImageUploadSession', () => {
  it('separates saved uploads from images removed from the submitted form', async () => {
    const onComplete = vi.fn();
    const onDiscard = vi.fn();

    render(
      <ImageUploadSessionHarness
        onComplete={onComplete}
        onDiscard={onDiscard}
      />,
    );

    await page.getByRole('button', { name: 'Track saved' }).click();
    await page.getByRole('button', { name: 'Track removed' }).click();
    await page.getByRole('button', { name: 'Track removed' }).click();
    await page.getByRole('button', { name: 'Complete session' }).click();

    expect(onComplete).toHaveBeenCalledWith({
      savedIds: ['saved-image'],
      discardedIds: ['removed-image'],
    });

    await page.getByRole('button', { name: 'Complete session' }).click();
    expect(onComplete).toHaveBeenLastCalledWith({
      savedIds: [],
      discardedIds: [],
    });
  });

  it('returns every tracked upload when the dialog session is discarded', async () => {
    const onComplete = vi.fn();
    const onDiscard = vi.fn();

    render(
      <ImageUploadSessionHarness
        onComplete={onComplete}
        onDiscard={onDiscard}
      />,
    );

    await page.getByRole('button', { name: 'Track saved' }).click();
    await page.getByRole('button', { name: 'Track removed' }).click();
    await page.getByRole('button', { name: 'Discard session' }).click();

    expect(onDiscard).toHaveBeenCalledWith(['saved-image', 'removed-image']);

    await page.getByRole('button', { name: 'Discard session' }).click();
    expect(onDiscard).toHaveBeenLastCalledWith([]);
  });
});
