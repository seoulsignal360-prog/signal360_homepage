-- ============================================================================
-- Signal360 — Initial Schema (0001)
-- ----------------------------------------------------------------------------
-- Tables (7): users, admin_users, products, orders, payments, refunds, deliveries
-- Triggers: updated_at auto-set on users/products/orders/payments/deliveries
-- RLS: enabled on all tables. Service-role key bypasses RLS for server-side ops.
-- Seed: 4 products (analysis-general, analysis-silver, replan-silver, replan-general)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";  -- gen_random_uuid()


-- ----------------------------------------------------------------------------
-- Helper: trigger function for updated_at
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================================
-- TABLES
-- ============================================================================

-- ---- users (profile linked to auth.users) ----------------------------------
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);


-- ---- admin_users -----------------------------------------------------------
create table public.admin_users (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'staff'
              check (role in ('super_admin', 'admin', 'staff')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);


-- ---- is_admin() helper (depends on admin_users) ----------------------------
-- security definer + fixed search_path so this can read admin_users even when
-- RLS would otherwise hide rows from the calling user.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and is_active = true
  );
$$;


-- ---- products --------------------------------------------------------------
create table public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name            text not null,
  description     text,
  category        text not null check (category in ('analysis', 'replan')),
  tier            text not null check (tier in ('general', 'silver')),
  price           integer not null check (price >= 0),
  display_order   integer not null default 0,
  is_active       boolean not null default true,
  thumbnail_url   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);


-- ---- orders ----------------------------------------------------------------
create table public.orders (
  id                      uuid primary key default gen_random_uuid(),
  order_number            text unique not null,            -- e.g. 'SG-20260425-0001'
  user_id                 uuid references public.users(id) on delete set null,
  is_guest                boolean not null default false,
  buyer_name              text not null,
  buyer_phone             text not null,
  buyer_email             text,
  product_id              uuid not null references public.products(id) on delete restrict,
  product_name_snapshot   text not null,                   -- snapshot for price/name change protection
  amount                  integer not null check (amount >= 0),
  status                  text not null default 'pending'
                          check (status in (
                            'pending', 'paid', 'failed', 'cancelled',
                            'refunded', 'in_progress', 'completed'
                          )),
  admin_memo              text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index orders_user_id_idx     on public.orders(user_id);
create index orders_status_idx      on public.orders(status);
create index orders_created_at_idx  on public.orders(created_at desc);


-- ---- payments --------------------------------------------------------------
create table public.payments (
  id                        uuid primary key default gen_random_uuid(),
  order_id                  uuid not null references public.orders(id) on delete restrict,
  pg_provider               text not null default 'seedpay',
  pg_transaction_id         text,                          -- SeedPay tid
  pg_payment_key            text,                          -- SeedPay tid (for cancellation)
  method                    text check (method in ('card', 'transfer', 'virtual_account')),
  amount                    integer not null check (amount >= 0),
  card_company              text,
  card_number_masked        text,
  installment_months        integer not null default 0,
  virtual_account_number    text,
  virtual_account_bank      text,
  virtual_account_due_at    timestamptz,
  status                    text not null default 'requested'
                            check (status in (
                              'requested', 'approved', 'failed',
                              'cancelled', 'pending_deposit'
                            )),
  raw_request               jsonb,
  raw_response              jsonb,
  approved_at               timestamptz,
  cancelled_at              timestamptz,
  failed_at                 timestamptz,
  failed_reason             text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index payments_order_id_idx           on public.payments(order_id);
create index payments_pg_transaction_id_idx  on public.payments(pg_transaction_id);


-- ---- refunds ---------------------------------------------------------------
create table public.refunds (
  id            uuid primary key default gen_random_uuid(),
  payment_id    uuid not null references public.payments(id) on delete restrict,
  order_id      uuid not null references public.orders(id)   on delete restrict,
  amount        integer not null check (amount >= 0),
  reason        text not null,
  status        text not null default 'requested'
                check (status in ('requested', 'approved', 'completed', 'failed')),
  processed_by  uuid references auth.users(id) on delete set null,
  raw_response  jsonb,
  requested_at  timestamptz not null default now(),
  completed_at  timestamptz,
  created_at    timestamptz not null default now()
);


-- ---- deliveries ------------------------------------------------------------
create table public.deliveries (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid unique not null references public.orders(id) on delete restrict,
  status          text not null default 'pending'
                  check (status in ('pending', 'in_progress', 'delivered')),
  consultant_id   uuid references auth.users(id) on delete set null,
  result_data     jsonb,
  result_file_url text,
  notes           text,
  started_at      timestamptz,
  delivered_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);


-- ============================================================================
-- updated_at TRIGGERS
-- ============================================================================
create trigger set_updated_at_users      before update on public.users
  for each row execute function public.set_updated_at();

create trigger set_updated_at_products   before update on public.products
  for each row execute function public.set_updated_at();

create trigger set_updated_at_orders     before update on public.orders
  for each row execute function public.set_updated_at();

create trigger set_updated_at_payments   before update on public.payments
  for each row execute function public.set_updated_at();

create trigger set_updated_at_deliveries before update on public.deliveries
  for each row execute function public.set_updated_at();


-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.users        enable row level security;
alter table public.admin_users  enable row level security;
alter table public.products     enable row level security;
alter table public.orders       enable row level security;
alter table public.payments     enable row level security;
alter table public.refunds      enable row level security;
alter table public.deliveries   enable row level security;


-- ---- users -----------------------------------------------------------------
create policy "users_select_self_or_admin" on public.users for select
  using (auth.uid() = id or public.is_admin());

create policy "users_insert_self" on public.users for insert
  with check (auth.uid() = id);

create policy "users_update_self_or_admin" on public.users for update
  using      (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

create policy "users_delete_admin" on public.users for delete
  using (public.is_admin());


-- ---- admin_users -----------------------------------------------------------
create policy "admin_users_select_self" on public.admin_users for select
  using (auth.uid() = user_id);

create policy "admin_users_admin_all" on public.admin_users for all
  using      (public.is_admin())
  with check (public.is_admin());


-- ---- products (public read, admin write) -----------------------------------
create policy "products_select_all" on public.products for select
  using (true);

create policy "products_admin_insert" on public.products for insert
  with check (public.is_admin());

create policy "products_admin_update" on public.products for update
  using      (public.is_admin())
  with check (public.is_admin());

create policy "products_admin_delete" on public.products for delete
  using (public.is_admin());


-- ---- orders (own read + admin all) -----------------------------------------
create policy "orders_select_own_or_admin" on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

create policy "orders_admin_insert" on public.orders for insert
  with check (public.is_admin());

create policy "orders_admin_update" on public.orders for update
  using      (public.is_admin())
  with check (public.is_admin());

create policy "orders_admin_delete" on public.orders for delete
  using (public.is_admin());


-- ---- payments (admin only) -------------------------------------------------
create policy "payments_admin_select" on public.payments for select
  using (public.is_admin());

create policy "payments_admin_insert" on public.payments for insert
  with check (public.is_admin());

create policy "payments_admin_update" on public.payments for update
  using      (public.is_admin())
  with check (public.is_admin());

create policy "payments_admin_delete" on public.payments for delete
  using (public.is_admin());


-- ---- refunds (admin only) --------------------------------------------------
create policy "refunds_admin_select" on public.refunds for select
  using (public.is_admin());

create policy "refunds_admin_insert" on public.refunds for insert
  with check (public.is_admin());

create policy "refunds_admin_update" on public.refunds for update
  using      (public.is_admin())
  with check (public.is_admin());

create policy "refunds_admin_delete" on public.refunds for delete
  using (public.is_admin());


-- ---- deliveries (own order read + admin all) -------------------------------
create policy "deliveries_select_own_order_or_admin" on public.deliveries for select
  using (
    public.is_admin() or exists (
      select 1 from public.orders o
      where o.id = public.deliveries.order_id and o.user_id = auth.uid()
    )
  );

create policy "deliveries_admin_insert" on public.deliveries for insert
  with check (public.is_admin());

create policy "deliveries_admin_update" on public.deliveries for update
  using      (public.is_admin())
  with check (public.is_admin());

create policy "deliveries_admin_delete" on public.deliveries for delete
  using (public.is_admin());


-- ============================================================================
-- SEED: products (4 rows)
-- ============================================================================
insert into public.products (slug, name, category, tier, price, display_order) values
  ('analysis-general', '보장 분석 리모델링 (일반)', 'analysis', 'general', 90000, 1),
  ('analysis-silver',  '보장 분석 리모델링 (실버)', 'analysis', 'silver',  80000, 2),
  ('replan-silver',    '보험료 플랜 재설계 (실버)', 'replan',   'silver',  70000, 3),
  ('replan-general',   '보험료 플랜 재설계 (일반)', 'replan',   'general', 80000, 4)
on conflict (slug) do nothing;
