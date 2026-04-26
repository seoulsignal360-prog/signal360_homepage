import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

const krw = new Intl.NumberFormat("ko-KR");

async function fetchCount(
  supabase: ReturnType<typeof createClient>,
  status: string
): Promise<number> {
  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("status", status);
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [pendingCount, paidCount, inProgressCount] = await Promise.all([
    fetchCount(supabase, "pending"),
    fetchCount(supabase, "paid"),
    fetchCount(supabase, "in_progress"),
  ]);

  const cards = [
    {
      label: "결제 대기",
      value: pendingCount,
      href: "/admin/orders?status=pending",
    },
    {
      label: "결제 완료",
      value: paidCount,
      href: "/admin/orders?status=paid",
    },
    {
      label: "진행 중",
      value: inProgressCount,
      href: "/admin/orders?status=in_progress",
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-h2 text-fg">관리자 대시보드</h1>
        <p className="text-body text-muted">환영합니다, {user?.email}.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white rounded-card p-6 border border-card-light hover:border-primary/40 hover:shadow-sm transition-all flex flex-col gap-2"
          >
            <span className="text-caption text-muted">{c.label}</span>
            <span className="text-h2 text-fg">{krw.format(c.value)}</span>
          </Link>
        ))}
      </div>

      <Link
        href="/admin/orders"
        className="bg-white rounded-card p-6 border border-card-light flex items-center justify-between hover:border-primary/40 transition-colors"
      >
        <div className="flex flex-col gap-1">
          <span className="text-h3 text-fg">주문 관리로 이동</span>
          <span className="text-caption text-muted">
            모든 주문 조회 · 상태 변경 · 메모 관리
          </span>
        </div>
        <ArrowRight size={20} strokeWidth={2} className="text-muted" />
      </Link>
    </div>
  );
}
