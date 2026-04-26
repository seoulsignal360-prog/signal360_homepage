import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { OrderEditPanel } from "./OrderEditPanel";
import {
  STATUS_BADGE,
  STATUS_LABEL,
  isOrderStatus,
  type OrderStatus,
} from "../types";

const krw = new Intl.NumberFormat("ko-KR");
const dateFmt = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "Asia/Seoul",
});

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  requested: "요청됨",
  approved: "승인",
  failed: "실패",
  cancelled: "취소",
  pending_deposit: "입금 대기",
};

const METHOD_LABEL: Record<string, string> = {
  card: "카드",
  transfer: "계좌이체",
  virtual_account: "가상계좌",
};

type Order = {
  id: string;
  order_number: string;
  is_guest: boolean;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string | null;
  product_id: string;
  product_name_snapshot: string;
  amount: number;
  status: OrderStatus;
  admin_memo: string | null;
  created_at: string;
  updated_at: string;
};

type Payment = {
  id: string;
  pg_provider: string;
  pg_transaction_id: string | null;
  method: string | null;
  amount: number;
  card_company: string | null;
  card_number_masked: string | null;
  installment_months: number;
  status: string;
  approved_at: string | null;
  cancelled_at: string | null;
  failed_at: string | null;
  failed_reason: string | null;
  created_at: string;
};

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

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, order_number, is_guest, buyer_name, buyer_phone, buyer_email, product_id, product_name_snapshot, amount, status, admin_memo, created_at, updated_at"
    )
    .eq("id", id)
    .maybeSingle<Order>();

  if (!order || !isOrderStatus(order.status)) {
    notFound();
  }

  const { data: payments } = await supabase
    .from("payments")
    .select(
      "id, pg_provider, pg_transaction_id, method, amount, card_company, card_number_masked, installment_months, status, approved_at, cancelled_at, failed_at, failed_reason, created_at"
    )
    .eq("order_id", order.id)
    .order("created_at", { ascending: false })
    .returns<Payment[]>();

  const paymentList = payments ?? [];

  return (
    <div className="flex flex-col gap-6 max-w-[1100px]">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/orders"
          className="flex items-center gap-1 text-caption text-muted hover:text-fg"
        >
          <ChevronLeft size={16} strokeWidth={2} />
          주문 목록
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-h2 text-fg font-mono">{order.order_number}</h1>
          <div className="flex items-center gap-3 text-caption text-muted">
            <span>주문일시 {dateFmt.format(new Date(order.created_at))}</span>
            <span>·</span>
            <span>{order.is_guest ? "비회원" : "회원"}</span>
          </div>
        </div>
        <span
          className={`inline-block px-3 py-1 rounded-pill text-caption font-medium ${
            STATUS_BADGE[order.status]
          }`}
        >
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-card p-6 border border-card-light flex flex-col gap-5">
          <h2 className="text-h3 text-fg">주문 정보</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Field label="상품">{order.product_name_snapshot}</Field>
            <Field label="결제 금액">
              <span className="font-medium">{krw.format(order.amount)}원</span>
            </Field>
            <Field label="구매자">{order.buyer_name}</Field>
            <Field label="연락처">{order.buyer_phone}</Field>
            <Field label="이메일">
              {order.buyer_email || (
                <span className="text-muted">—</span>
              )}
            </Field>
            <Field label="최종 수정">
              <span className="text-caption text-muted">
                {dateFmt.format(new Date(order.updated_at))}
              </span>
            </Field>
          </div>
        </div>

        <OrderEditPanel
          orderId={order.id}
          initialStatus={order.status}
          initialMemo={order.admin_memo ?? ""}
        />
      </div>

      <div className="bg-white rounded-card p-6 border border-card-light flex flex-col gap-4">
        <h2 className="text-h3 text-fg">결제 내역</h2>
        {paymentList.length === 0 && (
          <p className="text-body text-muted">결제 내역이 없습니다.</p>
        )}
        {paymentList.map((p) => (
          <div
            key={p.id}
            className="border border-card-light rounded-lg p-4 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4"
          >
            <Field label="PG">{p.pg_provider}</Field>
            <Field label="결제수단">
              {p.method ? METHOD_LABEL[p.method] ?? p.method : "—"}
            </Field>
            <Field label="상태">
              {PAYMENT_STATUS_LABEL[p.status] ?? p.status}
            </Field>
            <Field label="금액">{krw.format(p.amount)}원</Field>
            <Field label="TID">
              <span className="font-mono text-caption">
                {p.pg_transaction_id ?? "—"}
              </span>
            </Field>
            <Field label="카드">
              {p.card_company ? `${p.card_company} ${p.card_number_masked ?? ""}` : "—"}
            </Field>
            <Field label="할부">
              {p.installment_months > 0 ? `${p.installment_months}개월` : "일시불"}
            </Field>
            <Field label="승인시각">
              <span className="text-caption text-muted">
                {p.approved_at
                  ? dateFmt.format(new Date(p.approved_at))
                  : "—"}
              </span>
            </Field>
            {p.failed_reason && (
              <div className="col-span-2 lg:col-span-4">
                <Field label="실패 사유">
                  <span className="text-caption text-red-700">
                    {p.failed_reason}
                  </span>
                </Field>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
