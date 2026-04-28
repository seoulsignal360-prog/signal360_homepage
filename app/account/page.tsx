import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/app/components/ui/Container";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "내 계정 - 시그널360",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "결제 대기",
  paid: "결제 완료",
  in_progress: "진행 중",
  completed: "완료",
  cancelled: "취소",
  refunded: "환불",
  failed: "실패",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  in_progress: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-200 text-gray-700",
  refunded: "bg-orange-100 text-orange-800",
  failed: "bg-red-100 text-red-800",
};

const krw = new Intl.NumberFormat("ko-KR");
const dateFmt = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Seoul",
});

type OrderRow = {
  id: string;
  order_number: string;
  product_name_snapshot: string;
  amount: number;
  status: string;
  created_at: string;
};

export default async function AccountPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const { data: profile } = await supabase
    .from("users")
    .select("name, phone")
    .eq("id", user.id)
    .maybeSingle();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, product_name_snapshot, amount, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<OrderRow[]>();

  const orderList = orders ?? [];
  const displayName =
    profile?.name ||
    (user.user_metadata as { name?: string; full_name?: string })?.name ||
    (user.user_metadata as { full_name?: string })?.full_name ||
    user.email ||
    "회원";

  return (
    <main className="flex-1 bg-surface py-16 lg:py-20">
      <Container>
        <div className="flex flex-col gap-10 max-w-[900px]">
          <div className="flex flex-col gap-2">
            <h1 className="text-h2 text-fg">내 계정</h1>
            <p className="text-body text-muted">
              안녕하세요, <span className="text-fg">{displayName}</span>님.
            </p>
          </div>

          <section className="bg-white rounded-card p-6 lg:p-8 flex flex-col gap-4">
            <h2 className="text-h3 text-fg">프로필</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <Field label="이름">{displayName}</Field>
              <Field label="이메일">
                {user.email || <span className="text-muted">—</span>}
              </Field>
              <Field label="연락처">
                {profile?.phone || <span className="text-muted">미등록</span>}
              </Field>
              <Field label="가입 경로">
                {(user.app_metadata as { provider?: string })?.provider ??
                  "email"}
              </Field>
            </div>
            <form action="/auth/signout" method="post" className="self-end">
              <button
                type="submit"
                className="h-10 px-4 rounded-lg border border-card-light text-caption text-muted hover:text-fg hover:border-muted/50"
              >
                로그아웃
              </button>
            </form>
          </section>

          <section className="bg-white rounded-card p-6 lg:p-8 flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-h3 text-fg">주문 내역</h2>
              <span className="text-caption text-muted">
                총 {krw.format(orderList.length)}건
              </span>
            </div>

            {orderList.length === 0 ? (
              <div className="py-10 flex flex-col items-center gap-3 text-center">
                <p className="text-body text-muted">아직 주문 내역이 없습니다.</p>
                <Link
                  href="/#service"
                  className="text-caption text-primary hover:underline"
                >
                  상품 보러가기 →
                </Link>
              </div>
            ) : (
              <ul className="flex flex-col divide-y divide-card-light">
                {orderList.map((o) => (
                  <li
                    key={o.id}
                    className="py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-caption text-muted">
                          {o.order_number}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[12px] ${
                            STATUS_BADGE[o.status] ??
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {STATUS_LABEL[o.status] ?? o.status}
                        </span>
                      </div>
                      <p className="text-body text-fg">
                        {o.product_name_snapshot}
                      </p>
                      <p className="text-caption text-muted">
                        {dateFmt.format(new Date(o.created_at))}
                      </p>
                    </div>
                    <span className="text-lead font-bold text-fg">
                      {krw.format(o.amount)}원
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-caption text-muted">{label}</span>
      <span className="text-body text-fg">{children}</span>
    </div>
  );
}
