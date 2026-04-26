# Signal360

보험설계사 대상 DB 매칭 플랫폼. Next.js 16 App Router + Supabase + Tailwind v4.

## Getting Started

```bash
npm install
npm run dev          # http://localhost:3000
```

`.env.local` 필요 (gitignored):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...           # 서버 전용 (RLS 우회)
SEEDPAY_MID=...                         # 결제 테스트 시
SEEDPAY_MERCHANT_KEY=...
SEEDPAY_API_BASE=https://devpay.seedpayments.co.kr
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Database Schema

`supabase/migrations/0001_initial_schema.sql` — 7 tables, RLS, seed data, helper
functions (`is_admin()`, `generate_order_number()`).

Supabase Dashboard SQL Editor에 붙여넣고 Run.

## 첫 super_admin 등록

코드 배포 후 본인이 직접 처리:

1. **Supabase Auth에 사용자 생성**
   - Dashboard → Authentication → Users → "Add user"
   - Email + 강한 비밀번호 입력
   - "Auto Confirm User" 체크 (이메일 인증 스킵)

2. **`admin_users` 테이블에 super_admin 레코드 추가**

   Dashboard → SQL Editor:
   ```sql
   INSERT INTO public.admin_users (user_id, role, is_active)
   VALUES (
     (SELECT id FROM auth.users WHERE email = '본인 이메일'),
     'super_admin',
     true
   );
   ```

3. **로그인 확인**
   - https://signal360.vercel.app/admin/login (또는 로컬은 http://localhost:3000/admin/login)
   - 이메일 + 비밀번호 입력 → `/admin` 으로 이동되면 성공

추가 admin/staff 계정도 같은 흐름. `role`만 `'admin'` / `'staff'`로 바꾸면 됨.

## Routes

### Public
- `/` — 랜딩 페이지
- `/checkout?product=<slug>` — 결제 페이지
- `/checkout/success`, `/checkout/fail`
- `/terms`, `/privacy` (placeholder)

### Admin
- `/admin/login` — 관리자 로그인
- `/admin` — 대시보드 (super_admin/admin/staff)
- `/admin/*` — `proxy.ts`에서 인증 + admin_users 검증

### API
- `POST /api/payment/request` — 결제 시작 (orders + payments INSERT)
- `POST /api/payment/approve` — SeedPay returnUrl 핸들러
- `POST /api/payment/webhook` — 결제 통보 (멱등성, IP 제한 옵션)

## Tech Stack

- Next.js 16.2 (App Router, Turbopack 기본, `proxy.ts` for middleware)
- React 19
- Tailwind CSS v4 (`@theme` tokens in `app/globals.css`)
- TypeScript 5
- Supabase (Auth, Postgres, RLS)
- Embla Carousel, Radix Accordion, Lucide Icons
- Pretendard Variable (next/font/local)
