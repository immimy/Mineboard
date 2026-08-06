import { randomUUID } from 'node:crypto';

function normalizeValue(type, rawValue, publicIdsByAssetKey) {
  if (type === 'checkbox' && typeof rawValue === 'string') {
    return { checked: false, title: rawValue };
  }
  if (type === 'tag') {
    return rawValue.map(([tag, color]) =>
      color === undefined ? { tag } : { tag, color },
    );
  }
  if (type === 'image') {
    return rawValue.map((assetKey) => {
      const publicId = publicIdsByAssetKey.get(assetKey);
      if (!publicId) {
        throw new Error(`Missing Cloudinary upload for ${assetKey}.`);
      }
      return publicId;
    });
  }
  return rawValue;
}

export function buildDatabaseRows(boards, userId, publicIdsByAssetKey) {
  const rows = {
    boards: [],
    cards: [],
    lists: [],
    listFields: [],
    listValues: [],
  };

  for (const board of boards) {
    const boardId = randomUUID();
    rows.boards.push({ id: boardId, user_id: userId, title: board.title });
    const fieldsByKey = new Map();

    board.fields.forEach((field, position) => {
      const fieldId = randomUUID();
      fieldsByKey.set(field.key, { id: fieldId, type: field.type });
      rows.listFields.push({
        id: fieldId,
        board_id: boardId,
        type: field.type,
        config: field.config,
        position,
      });
    });

    board.cards.forEach((card, cardPosition) => {
      const cardId = randomUUID();
      rows.cards.push({
        id: cardId,
        board_id: boardId,
        title: card.title,
        color: card.color,
        position: cardPosition,
      });

      card.items.forEach((item, listPosition) => {
        const listId = randomUUID();
        rows.lists.push({
          id: listId,
          card_id: cardId,
          position: listPosition,
        });

        for (const [fieldKey, rawValue] of Object.entries(item)) {
          const field = fieldsByKey.get(fieldKey);
          if (!field) {
            throw new Error(
              `Unknown field key ${fieldKey} on board ${board.title}.`,
            );
          }
          rows.listValues.push({
            id: randomUUID(),
            list_id: listId,
            list_field_id: field.id,
            value: normalizeValue(field.type, rawValue, publicIdsByAssetKey),
          });
        }
      });
    });
  }
  return rows;
}
