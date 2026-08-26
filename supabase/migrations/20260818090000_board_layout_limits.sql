-- ============================================================
-- Board layout limits
--
-- A single private configuration row is shared by layout-saving validation
-- and the card/list capacity triggers.
-- ============================================================

create table private.board_layout_limits (
  singleton boolean primary key default true,
  max_cards_per_board integer not null,
  max_lists_per_board integer not null,

  constraint board_layout_limits_singleton check (singleton),
  constraint board_layout_limits_max_cards_positive
    check (max_cards_per_board > 0),
  constraint board_layout_limits_max_lists_positive
    check (max_lists_per_board > 0)
);

insert into private.board_layout_limits (
  max_cards_per_board,
  max_lists_per_board
)
values (30, 100);

revoke all on private.board_layout_limits
  from public, authenticated;

-- The invoker-security layout RPC and triggers only need to read the limits.
grant select on private.board_layout_limits
  to authenticated, service_role;
