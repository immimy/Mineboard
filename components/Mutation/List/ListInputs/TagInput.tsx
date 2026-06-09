import { TagInput as TagForm } from '@/types/jsonbSchema';
import { ListFieldInputProps } from '.';
import { ClipboardEventHandler, KeyboardEventHandler, useState } from 'react';
import { Field, Fieldset, Input } from '@headlessui/react';
import TagsDisplay from './TagsDisplay';
import { useFormStatus } from 'react-dom';

function TagInput({
  field,
  form,
  handleFieldChange,
}: Omit<ListFieldInputProps, 'form'> & { form: TagForm }) {
  const { pending } = useFormStatus();

  /** Draft text for typing */
  const [draft, setDraft] = useState('');

  /** UPDATE FORM STATE: text value update */
  const commitTags = (incomingTags: string[]) => {
    const tags = incomingTags.map((tag) => ({ tag }));
    handleFieldChange(field.id, {
      ...form,
      value: [...form.value, ...tags],
    });
  };

  /** Feature: Display text as a tag */
  // 1. when press 'enter' or 'space'
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Backspace') return;

    if ((e.key === 'Enter' || e.key === ' ') && draft.trim()) {
      e.preventDefault();
      commitTags([draft.trim()]);
      setDraft('');
    }

    if (e.key === 'Backspace' && !draft && form.value.length) {
      const value = form.value.slice(0, -1);
      handleFieldChange(field.id, {
        ...form,
        value,
      });
    }
  };
  // 2. when paste texts from the clipboard
  const handlePaste: ClipboardEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();

    const clipboard = e.clipboardData.getData('text');

    const isEndsWithSpace = /\s$/.test(clipboard);
    const parts = clipboard.trim().split(/\s+/);

    const completedTags = isEndsWithSpace ? parts : parts.slice(0, -1);
    const nextDraft = isEndsWithSpace ? '' : (parts.at(-1) ?? '');

    if (completedTags.length) commitTags(completedTags);

    setDraft(nextDraft);
  };

  return (
    <li style={{ order: field.position }}>
      <Fieldset disabled={pending}>
        <Field className='w-full flex flex-wrap items-center gap-2 rounded px-2 py-1 max-w-md md:max-w-2xl lg:max-w-4xl'>
          {/* DISPLAY TAGS */}
          <TagsDisplay
            field={field}
            form={form}
            handleFieldChange={handleFieldChange}
          />
          {/* TAG INPUT */}
          <Input
            type='text'
            value={draft}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onChange={(e) => setDraft(e.target.value)}
            placeholder='Add tag...'
            className='grow bg-transparent outline-none'
          />
        </Field>
      </Fieldset>
    </li>
  );
}

export default TagInput;
