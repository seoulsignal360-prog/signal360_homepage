"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { PaymentError, cancelPayment } from "@/lib/seedpay/client";
import { isOrderStatus } from "./types";

type ActionResult = { ok: true } | { ok: false; error: string };

async function assertAdmin() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { supabase: null, userId: null, error: "unauthorized" as const };
  }
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();
  if (!adminUser) {
    return { supabase: null, userId: null, error: "forbidden" as const };
  }
  return { supabase, userId: user.id, error: null };
}

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<ActionResult> {
  if (!isOrderStatus(status)) {
    return { ok: false, error: "잘못된 상태값입니다" };
  }
  const { supabase, error } = await assertAdmin();
  if (!supabase) return { ok: false, error: error ?? "권한 없음" };

  const { error: updateErr } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (updateErr) {
    console.error("[updateOrderStatus]", updateErr);
    return { ok: false, error: "상태 변경에 실패했습니다" };
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { ok: true };
}

export async function updateOrderMemo(
  orderId: string,
  memo: string
): Promise<ActionResult> {
  if (memo.length > 2000) {
    return { ok: false, error: "메모는 2000자 이내여야 합니다" };
  }
  const { supabase, error } = await assertAdmin();
  if (!supabase) return { ok: false, error: error ?? "권한 없음" };

  const { error: updateErr } = await supabase
    .from("orders")
    .update({ admin_memo: memo.trim() || null })
    .eq("id", orderId);
  if (updateErr) {
    console.error("[updateOrderMemo]", updateErr);
    return { ok: false, error: "메모 저장에 실패했습니다" };
  }

  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}

export async function processRefund(
  orderId: string,
  reason: string
): Promise<ActionResult> {
  const trimmedReason = reason.trim();
  if (trimmedReason.length < 2) {
    return { ok: false, error: "환불 사유를 2자 이상 입력해주세요" };
  }
  if (trimmedReason.length > 200) {
    return { ok: false, error: "환불 사유는 200자 이내여야 합니다" };
  }

  const { supabase, userId, error } = await assertAdmin();
  if (!supabase || !userId) {
    return { ok: false, error: error ?? "권한 없음" };
  }

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("id, status, amount")
    .eq("id", orderId)
    .maybeSingle();
  if (orderErr || !order) {
    return { ok: false, error: "주문을 찾을 수 없습니다" };
  }
  if (order.status !== "paid") {
    return {
      ok: false,
      error: "결제 완료(paid) 상태인 주문만 환불할 수 있습니다",
    };
  }

  const { data: payment, error: payErr } = await supabase
    .from("payments")
    .select("id, pg_payment_key, pg_transaction_id, status, amount")
    .eq("order_id", orderId)
    .eq("status", "approved")
    .order("approved_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (payErr || !payment) {
    return { ok: false, error: "승인된 결제 내역을 찾을 수 없습니다" };
  }
  const tid = payment.pg_payment_key ?? payment.pg_transaction_id;
  if (!tid) {
    return { ok: false, error: "PG 거래번호(TID)가 없어 환불할 수 없습니다" };
  }

  const { data: refund, error: insertErr } = await supabase
    .from("refunds")
    .insert({
      payment_id: payment.id,
      order_id: order.id,
      amount: order.amount,
      reason: trimmedReason,
      status: "processing",
      processed_by: userId,
    })
    .select("id")
    .single();
  if (insertErr || !refund) {
    console.error("[processRefund] refund insert failed", insertErr);
    return { ok: false, error: "환불 기록 생성에 실패했습니다" };
  }

  try {
    const cancelRes = await cancelPayment(tid, trimmedReason);
    const now = new Date().toISOString();
    await Promise.all([
      supabase
        .from("refunds")
        .update({
          status: "completed",
          completed_at: now,
          raw_response: cancelRes as unknown as Record<string, unknown>,
        })
        .eq("id", refund.id),
      supabase
        .from("payments")
        .update({ status: "cancelled", cancelled_at: now })
        .eq("id", payment.id),
      supabase
        .from("orders")
        .update({ status: "refunded" })
        .eq("id", order.id),
    ]);
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
    return { ok: true };
  } catch (err) {
    const message =
      err instanceof PaymentError
        ? `${err.code}: ${err.message}`
        : (err as Error).message || "unknown";
    console.error("[processRefund] cancel API failed", err);
    await supabase
      .from("refunds")
      .update({
        status: "failed",
        raw_response: { error: message } as Record<string, unknown>,
      })
      .eq("id", refund.id);
    revalidatePath(`/admin/orders/${orderId}`);
    return {
      ok: false,
      error: `PG 환불 호출 실패: ${message.slice(0, 200)}`,
    };
  }
}
