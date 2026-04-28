-- ============================================================================
-- Signal360 — Migration 0002: auto-create users profile on auth signup
-- ----------------------------------------------------------------------------
-- When a new row appears in auth.users (any provider — email/Kakao/etc),
-- copy the linkable bits into public.users so the FK relationship in
-- orders.user_id can be used downstream.
--
-- Kakao OAuth via Supabase: provider returns name in user_metadata.full_name
-- or user_metadata.name (varies by Kakao profile fields requested).
-- ============================================================================

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, phone)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'preferred_username',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
