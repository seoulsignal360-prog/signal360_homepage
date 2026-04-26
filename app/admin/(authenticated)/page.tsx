import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-h2 text-fg">관리자 대시보드</h1>
        <p className="text-body text-muted">환영합니다, {user?.email}.</p>
      </div>

      <div className="bg-white rounded-card p-8 flex flex-col gap-3">
        <h2 className="text-h3 text-fg">Phase A — 인증 인프라</h2>
        <p className="text-body text-muted">
          관리자 페이지가 정상 동작 중입니다. 주문/결제/환불 관리는 Phase B에서
          추가됩니다.
        </p>
      </div>
    </div>
  );
}
