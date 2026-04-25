import { NextResponse } from "next/server";
import {
  generateEdiDate,
  generateHashString,
  verifySignData,
} from "@/lib/seedpay/hash";
import { PaymentError, approvePayment } from "@/lib/seedpay/client";
import { createServiceClient } from "@/utils/supabase/service";

function methodCodeToName(
  code: string | undefined
): "card" | "transfer" | "virtual_account" {
  if (code === "02") return "transfer";
  if (code === "03") return "virtual_account";
  return "card";
}

async function markFailed(orderId: string, reason: string): Promise<void> {
  try {
    const sb = createServiceClient();
    const now = new Date().toISOString();
    await sb.from("orders").update({ status: "failed" }).eq("id", orderId);
    await sb
      .from("payments")
      .update({
        status: "failed",
        failed_at: now,
        failed_reason: reason.slice(0, 500),
      })
      .eq("order_id", orderId);
  } catch (err) {
    console.error("[payment/approve] markFailed error", err);
  }
}

export async function POST(request: Request) {
  // 1. Parse form-encoded SeedPay return data.
  let fd: FormData;
  try {
    fd = await request.formData();
  } catch (err) {
    console.error("[payment/approve] formData parse failed", err);
    return NextResponse.redirect(
      new URL("/checkout/fail?reason=parse_error", request.url),
      303
    );
  }

  const get = (k: string): string => {
    const v = fd.get(k);
    return typeof v === "string" ? v : "";
  };
  const data = {
    resultCd: get("resultCd"),
    resultMsg: get("resultMsg"),
    nonce: get("nonce"),
    tid: get("tid"),
    mid: get("mid"),
    method: get("method"),
    ordNo: get("ordNo"),
    goodsAmt: get("goodsAmt"),
    ediDate: get("ediDate"),
    payData: get("payData"),
    signData: get("signData"),
    approvalUrl: get("approvalUrl"),
    netCancelUrl: get("netCancelUrl"),
    mbsReserved: get("mbsReserved"),
  };

  const failRedirect = (reason: string, ord?: string) => {
    const url = new URL("/checkout/fail", request.url);
    url.searchParams.set("reason", reason);
    if (ord) url.searchParams.set("order", ord);
    return NextResponse.redirect(url, 303);
  };
  const successRedirect = (ord: string) => {
    const url = new URL("/checkout/success", request.url);
    url.searchParams.set("order", ord);
    return NextResponse.redirect(url, 303);
  };

  // 2. Auth result check
  if (data.resultCd !== "0000") {
    console.warn("[payment/approve] auth failed", {
      resultCd: data.resultCd,
      resultMsg: data.resultMsg,
      ordNo: data.ordNo,
    });
    if (data.mbsReserved) {
      await markFailed(
        data.mbsReserved,
        `Auth failed: ${data.resultCd} ${data.resultMsg}`
      );
    }
    return failRedirect("user_cancel", data.ordNo);
  }

  // 3. Env check (fail fast)
  const merchantKey = process.env.SEEDPAY_MERCHANT_KEY;
  if (!merchantKey) {
    console.error("[payment/approve] SEEDPAY_MERCHANT_KEY not set");
    return failRedirect("service_unavailable", data.ordNo);
  }

  // 4. signData verification (constant-time hash compare)
  const sigOk = verifySignData(
    data.signData,
    data.tid,
    data.mid,
    data.ediDate,
    data.goodsAmt,
    data.ordNo,
    merchantKey
  );
  if (!sigOk) {
    console.error("[payment/approve] signData mismatch", {
      tid: data.tid,
      ordNo: data.ordNo,
    });
    if (data.mbsReserved) await markFailed(data.mbsReserved, "Signature mismatch");
    return failRedirect("signature_mismatch", data.ordNo);
  }

  // 5. Look up order via mbsReserved (the orders.id we sent)
  if (!data.mbsReserved) {
    console.error("[payment/approve] no mbsReserved");
    return failRedirect("invalid_order", data.ordNo);
  }
  const sb = createServiceClient();
  const { data: order, error: orderErr } = await sb
    .from("orders")
    .select("id, order_number, amount, status")
    .eq("id", data.mbsReserved)
    .maybeSingle();
  if (orderErr || !order) {
    console.error("[payment/approve] order lookup failed", orderErr);
    return failRedirect("invalid_order", data.ordNo);
  }
  // Already-processed orders: idempotent redirect to success/fail.
  if (order.status === "paid") return successRedirect(order.order_number);
  if (order.status !== "pending") {
    console.warn("[payment/approve] order in non-pending state", {
      id: order.id,
      status: order.status,
    });
    return failRedirect("invalid_order", data.ordNo);
  }

  // 6. Amount cross-check (db vs param)
  if (String(order.amount) !== data.goodsAmt) {
    console.error("[payment/approve] amount mismatch", {
      dbAmount: order.amount,
      paramAmount: data.goodsAmt,
    });
    await markFailed(
      order.id,
      `Amount mismatch: db=${order.amount} param=${data.goodsAmt}`
    );
    return failRedirect("amount_mismatch", data.ordNo);
  }

  // 7. Build approval body and POST to PG-supplied approvalUrl
  const newEdiDate = generateEdiDate();
  const hashString = generateHashString(
    data.mid,
    newEdiDate,
    data.goodsAmt,
    merchantKey
  );

  let approveRes;
  try {
    approveRes = await approvePayment(data.approvalUrl, {
      nonce: data.nonce,
      tid: data.tid,
      mid: data.mid,
      goodsAmt: data.goodsAmt,
      ediDate: newEdiDate,
      mbsReserved: data.mbsReserved,
      hashString,
      payData: data.payData,
    });
  } catch (err) {
    console.error("[payment/approve] approve API failed", err);
    const reason =
      err instanceof PaymentError
        ? `${err.code}: ${err.message}`
        : "approve_call_failed";
    await markFailed(order.id, reason);
    return failRedirect("approval_failed", data.ordNo);
  }

  // 8. Persist successful approval + flip order status to 'paid'
  const now = new Date().toISOString();
  const installment = parseInt(approveRes.quota || "0", 10) || 0;
  const [orderRes, payRes] = await Promise.all([
    sb.from("orders").update({ status: "paid" }).eq("id", order.id),
    sb
      .from("payments")
      .update({
        status: "approved",
        pg_transaction_id: approveRes.tid,
        pg_payment_key: approveRes.tid,
        method: methodCodeToName(approveRes.payMethod),
        card_company: approveRes.cardNm || null,
        card_number_masked: approveRes.cardNo || null,
        installment_months: installment,
        approved_at: now,
        raw_response: approveRes as unknown as Record<string, unknown>,
      })
      .eq("order_id", order.id),
  ]);
  if (orderRes.error || payRes.error) {
    console.error("[payment/approve] DB update after approval failed", {
      orderErr: orderRes.error,
      payErr: payRes.error,
    });
    // Don't redirect to fail — payment IS approved at PG. Webhook will reconcile.
  }

  return successRedirect(order.order_number);
}
