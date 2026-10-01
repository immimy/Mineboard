# Mutation feature map

Use this table to locate the UI and submission logic for each feature. All paths are relative to `components/Mutation`.

| Feature                       | Main file                                                                            | Purpose                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Create board                  | [Board/Title/AddBoardTitle.tsx](Board/Title/AddBoardTitle.tsx)                       | Board creation form and submission                                     |
| Rename board                  | [Board/Title/UpdateBoardTitle.tsx](Board/Title/UpdateBoardTitle.tsx)                 | Edit and save the board title                                          |
| Create card                   | [Card/AddCardDialog.tsx](Card/AddCardDialog.tsx)                                     | Create-card submission and cache update                                |
| Update or delete card         | [Card/UpdateCardDialog.tsx](Card/UpdateCardDialog.tsx)                               | Edit card details or delete the card                                   |
| Shared card form              | [Card/CardDialog.tsx](Card/CardDialog.tsx)                                           | Dialog layout, title input, and color selection                        |
| Create list                   | [List/AddListDialog.tsx](List/AddListDialog.tsx)                                     | Create-list submission and cache update                                |
| Update or delete list         | [List/UpdateListDialog.tsx](List/UpdateListDialog.tsx)                               | Edit list values or delete the list                                    |
| Open create-list dialog       | [List/AddListOpenButton.tsx](List/AddListOpenButton.tsx)                             | Open the dialog for a specific card                                    |
| Shared list form              | [List/ListDialog.tsx](List/ListDialog.tsx)                                           | Dialog layout and list-value inputs                                    |
| Configure board fields        | [Board/ListField/ListFieldDialog.tsx](Board/ListField/ListFieldDialog.tsx)           | Field configuration dialog                                             |
| Create or update board fields | [Board/ListField/FieldsForm.tsx](Board/ListField/FieldsForm.tsx)                     | Submit field definitions and changes                                   |
| Preview board fields          | [Board/ListField/FieldsPreview.tsx](Board/ListField/FieldsPreview.tsx)               | Preview the configured fields                                          |
| Field configuration state     | [Board/ListField/ListFieldFormContext.tsx](Board/ListField/ListFieldFormContext.tsx) | Manage draft fields and unsaved changes                                |
| Field configuration inputs    | [Board/Fields/](Board/Fields/)                                                       | Configure text, number, date, image, checkbox, and tag fields          |
| List-value inputs             | [List/ListInputs/](List/ListInputs/)                                                 | Enter actual values for those field types                              |
| Dialog state and controls     | [Context/](Context/README.md)                                                        | Dialog open/close actions and associated state in `*DialogContext.tsx` |
| Register dialog providers     | [Context/DialogsProvider.tsx](Context/DialogsProvider.tsx)                           | Combine the dialog context providers                                   |
| Board-title editing state     | [Board/Title/BoardTitleContext.tsx](Board/Title/BoardTitleContext.tsx)               | Shared state and actions for title editing                             |
| Shared icon button            | [IconButton.tsx](IconButton.tsx)                                                     | Reusable icon-button UI                                                |

`Board/Fields` configures what a field accepts; `List/ListInputs` lets users enter its value.

Tests live in nearby `__tests__` folders. Database writes are handled outside this folder in [board actions](../../utils/actions/board.ts), [card actions](../../utils/actions/card.ts), and [list actions](../../utils/actions/list.ts).
