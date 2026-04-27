import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import {
  ORDER_STATUSES,
  STATUS_BADGE,
  STATUS_LABEL,
  isOrderStatus,
  type OrderStatus,
} from "./types";

const PAGE_SIZE = 20;

type SearchParams = Promise<{
  status?: string;
  q?: string;
  page?: string;
}>;

type OrderRow = {
  id: string;
  order_number: string;
  buyer_name: string;
  buyer_phone: string;
  product_name_snapshot: string;
  amount: number;
  status: OrderStatus;
  created_at: string;
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

function buildHref(params: {
  status?: string;
  q?: string;
  page?: number;
}): string {
  const sp = new URLSearchParams();
  if (params.status) sp.set("status", params.status);
  if (params.q) sp.set("q", params.q);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return qs ? `/admin/orders?${qs}` : "/admin/orders";
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const status = isOrderStatus(sp.status) ? sp.status : undefined;
  const q = sp.q?.trim() || "";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let query = supabase
    .from("orders")
    .select(
      "id, order_number, buyer_name, buyer_phone, product_name_snapshot, amount, status, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) query = query.eq("status", status);
  if (q) {
    const safe = q.replace(/[%,]/g, "");
    query = query.or(
      `order_number.ilike.%${safe}%,buyer_name.ilike.%${safe}%,buyer_phone.ilike.%${safe}%`
    );
  }

  const { data, count, error } = await query;
  if (error) {
    console.error("[admin/orders] query failed", error);
  }
  const orders = (data ?? []) as OrderRow[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6 max-w-[1200px]">
      <div className="flex flex-col gap-2">
        <h1 className="text-h2 text-fg">주문 관리</h1>
        <p className="text-caption text-muted">총 {krw.format(total)}건</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={buildHref({ q })}
          className={`px-3 py-1.5 rounded-pill text-caption transition-colors ${
            !status
              ? "bg-fg text-white"
              : "bg-white text-muted hover:text-fg border border-card-light"
          }`}
        >
          전체
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={buildHref({ status: s, q })}
            className={`px-3 py-1.5 rounded-pill text-caption transition-colors ${
              status === s
                ? "bg-fg text-white"
                : "bg-white text-muted hover:text-fg border border-card-light"
            }`}
          >
            {STATUS_LABEL[s]}
          </Link>
        ))}
      </div>

      <form action="/admin/orders" method="get" className="flex gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="주문번호 / 이름 / 전화번호 검색"
          className="flex-1 max-w-md h-10 px-3 border border-card-light rounded-lg bg-white text-caption focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          className="h-10 px-4 rounded-lg bg-primary text-white text-caption font-medium hover:bg-[#4338CA]"
        >
          검색
        </button>
        {q && (
          <Link
            href={buildHref({ status })}
            className="h-10 px-4 rounded-lg border border-card-light text-caption text-muted hover:text-fg flex items-center"
          >
            초기화
          </Link>
        )}
      </form>

      <div className="bg-white rounded-card overflow-hidden border border-card-light">
        <table className="w-full text-caption">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="text-left px-4 py-3 font-medium">주문번호</th>
              <th className="text-left px-4 py-3 font-medium">주문일시</th>
              <th className="text-left px-4 py-3 font-medium">구매자</th>
              <th className="text-left px-4 py-3 font-medium">상품</th>
              <th className="text-right px-4 py-3 font-medium">금액</th>
              <th className="text-left px-4 py-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-muted"
                >
                  주문이 없습니다.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr
                key={o.id}
                className="border-t border-card-light hover:bg-surface/60 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-fg">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="hover:text-primary"
                  >
                    {o.order_number}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">
                  {dateFmt.format(new Date(o.created_at))}
                </td>
                <td className="px-4 py-3 text-fg">
                  <div className="flex flex-col">
                    <span>{o.buyer_name}</span>
                    <span className="text-muted text-[12px]">
                      {o.buyer_phone}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-fg">
                  {o.product_name_snapshot}
                </td>
                <td className="px-4 py-3 text-right text-fg font-medium">
                  {krw.format(o.amount)}원
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[12px] ${
                      STATUS_BADGE[o.status]
                    }`}
                  >
                    {STATUS_LABEL[o.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          {page > 1 && (
            <Link
              href={buildHref({ status, q, page: page - 1 })}
              className="px-3 py-1.5 border border-card-light rounded text-caption text-muted hover:text-fg"
            >
              이전
            </Link>
          )}
          <span className="text-caption text-muted">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildHref({ status, q, page: page + 1 })}
              className="px-3 py-1.5 border border-card-light rounded text-caption text-muted hover:text-fg"
            >
              다음
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
