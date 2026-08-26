import { ListFieldDraft, ListFieldInput } from './jsonbSchema';

export type Theme = 'light' | 'dark';

export type FormState<TData = undefined> = {
  data?: TData;
  error: string | null;
};

export type ActionFunction = (
  formState: FormState,
  formData: FormData,
) => Promise<FormState>;

export type ListFieldForm = ListFieldDraft & { position: number };

export type ListForm = Record<string, ListFieldInput>;

export type ActionMenuId =
  | 'edit-board-title'
  | 'custom-list-fields'
  | 'delete-board'
  | 'multiple-card-deletions';

// Drag and drop
export type DragControls = {
  ref: (element: Element | null) => void;
  handleRef: (element: Element | null) => void;
  isDragging: boolean;
  isDropTarget: boolean;
  index: number;
};
