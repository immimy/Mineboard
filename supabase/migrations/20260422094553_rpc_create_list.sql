-- ============================================================
-- RPC: create_list_with_values
-- Creates a list row and its initial list_value rows atomically.
--
-- Parameters:
--   p_card_id      uuid    — the card this list belongs to
--   p_field_values jsonb   — array of { list_field_id, value }
--
-- Returns: uuid — the new list's id
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_list_with_values(
  p_card_id      uuid,
  p_field_values jsonb   -- [{ "list_field_id": "...", "value": { ... } }]
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER  -- RLS is enforced
SET search_path = public, pg_temp
AS $$
DECLARE
  v_list_id   uuid;
  v_position  integer;
  v_field     jsonb;
BEGIN
  -- Derive the position for the new list
  SELECT COALESCE(MAX(position) + 1, 0)
    INTO v_position
    FROM public.lists
   WHERE card_id = p_card_id;

  -- Insert the list row
  INSERT INTO public.lists (card_id, position)
  VALUES (p_card_id, v_position)
  RETURNING id INTO v_list_id;

  -- Insert one list_value row per non-empty field value
  -- (empty values are already filtered out by the server action)
  FOR v_field IN
    SELECT value FROM jsonb_array_elements(p_field_values)
  LOOP
    INSERT INTO public.list_values (list_id, list_field_id, value)
    VALUES (
      v_list_id,
      (v_field->>'list_field_id')::uuid,
      v_field->'value'
    );
  END LOOP;

  RETURN v_list_id;
END;
$$;