-- ============================================================================
-- 0004_add_order_quantity.sql
-- Adds a quantity column to orders so customers can purchase multiple units of
-- the same product in a single transaction. amount continues to hold the total
-- (unit price × quantity); quantity stays alongside for clarity, reporting, and
-- to make admin pages able to render "5 × 80,000원" without divining from the
-- prior unit price (which can drift after the order was placed).
-- ============================================================================

alter table public.orders
  add column if not exists quantity integer not null default 1
  check (quantity >= 1 and quantity <= 999);

comment on column public.orders.quantity is
  '구매 수량. amount = products.price × quantity at order time.';
