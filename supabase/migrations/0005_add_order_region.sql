-- ============================================================================
-- 0005_add_order_region.sql
-- Adds a region column to orders. Customers must pick a region (수도권, 부산/
-- 울산/경남 등) at checkout so DB distribution can be scoped geographically.
-- Stored as text for flexibility — the canonical list lives in app code
-- (app/checkout/components/RegionSelect.tsx) and is also validated in the
-- /api/payment/request handler so a tampered request can't smuggle an
-- arbitrary string in.
-- ============================================================================

alter table public.orders
  add column if not exists region text;

comment on column public.orders.region is
  '구매자가 선택한 DB 분배 지역. 앱 단의 REGIONS 화이트리스트와 일치.';
