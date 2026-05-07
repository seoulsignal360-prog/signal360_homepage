-- ============================================================================
-- 0003_add_dev_test_product.sql
-- Adds a 100원 product used ONLY for end-to-end SeedPay verification against
-- the production MID. Hidden from the landing page (Section5 hardcodes 4 items),
-- reachable only via /checkout?product=dev-test.
-- ============================================================================

insert into public.products (slug, name, category, tier, price, display_order)
values ('dev-test', '[테스트] 개발 검증용', 'analysis', 'general', 100, 99)
on conflict (slug) do nothing;
