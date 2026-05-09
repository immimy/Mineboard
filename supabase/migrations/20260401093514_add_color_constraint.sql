create domain color_palette as smallint
 constraint only_predefined_colors
 check ( value >= 1 and value <= 9 );

alter table public.cards
 alter column color drop default;
alter table public.cards
 alter column color type color_palette using 1;
alter table public.cards
 alter column color set default 1;