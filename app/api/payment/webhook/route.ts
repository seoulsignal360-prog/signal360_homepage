import { createServiceClient } from "@/utils/supabase/service";

const ALLOWED_IPS = ["13.125.71.243", "43.202.81.140"];

type WebhookBody = {
  resultCd?: string;
  resultMsg?: string;
  tid?: string;
  mid?: string;
  ordNo?: string;
  goodsAmt?: string | number;
  trxStCd?: string;
  mbsReserved?: string;
  [key: string]: unknown;
};

type OrderUpdate = { status: string };
type PaymentUpdate = {
  status: string;
  approved_at?: string;
  cancelled_at?: string;
  failed_at?: string;
  failed_reason?: string;
};

export async function POST(request: Request) {
  // 0. Optional IP whitelist (enforce in prod via env flag)
  if (process.env.SEEDPAY_WEBHOOK_ENFORCE_IP === "true") {
    const fwd = request.headers.get("x-forwarded-for") || "";
    const clientIp = fwd.split(",")[0]?.trim();
    if (!clientIp || !ALLOWED_IPS.includes(clientIp)) {
      console.error("[webhook] unauthorized IP", clientIp);
      return new Response("Forbidden", { status: 403 });
    }
  }

  // 1. Parse JSON
  let body: WebhookBody;
  try {
    body = (await request.json()) as WebhookBody;
  } catch (err) {
    console.error("[webhook] invalid JSON", err);
    return new Response("Bad Request", { status: 400 });
  }

  const { resultCd, resultMsg, tid, ordNo, goodsAmt, trxStCd, mbsReserved } =
    body;

  if (!mbsReserved) {
    console.warn("[webhook] no mbsReserved, ack-only", body);
    return new Response("OK", { status: 200 });
  }

  const sb = createServiceClient();
  const { data: order, error: orderErr } = await sb
    .from("orders")
    .select("id, order_number, amount, status")
    .eq("id", mbsReserved)
    .maybeSingle();

  if (orderErr) {
    console.error("[webhook] order lookup error", orderErr);
    return new Response("Server Error", { status: 500 });
  }
  if (!order) {
    console.warn("[webhook] order not found, ack-only", { mbsReserved });
    return new Response("OK", { status: 200 });
  }

  // Cross-check ordNo
  if (ordNo && order.order_number !== ordNo) {
    console.error("[webhook] ordNo mismatch — possible replay/fraud", {
      orderId: order.id,
      dbOrdNo: order.order_number,
      paramOrdNo: ordNo,
    });
    return new Response("OK", { status: 200 });
  }
  // Cross-check amount
  if (
    goodsAmt !== undefined &&
    String(order.amount) !== String(goodsAmt)
  ) {
    console.error("[webhook] amount mismatch — possible fraud", {
      orderId: order.id,
      dbAmount: order.amount,
      paramAmount: goodsAmt,
    });
    return new Response("OK", { status: 200 });
  }

  // Idempotency: terminal states are not re-processed
  if (order.status !== "pending" && order.status !== "in_progress") {
    console.log("[webhook] idempotent ack", {
      orderId: order.id,
      status: order.status,
    });
    return new Response("OK", { status: 200 });
  }

  // Decide new status
  let newOrderStatus: string;
  let newPaymentStatus: string;

  if (resultCd === "0000") {
    if (trxStCd === undefined || trxStCd === "0") {
      newOrderStatus = "paid";
      newPaymentStatus = "approved";
    } else if (trxStCd === "1" || trxStCd === "2") {
      newOrderStatus = "cancelled";
      newPaymentStatus = "cancelled";
    } else {
      newOrderStatus = "failed";
      newPaymentStatus = "failed";
    }
  } else {
    newOrderStatus = "failed";
    newPaymentStatus = "failed";
  }

  const now = new Date().toISOString();
  const orderUpdate: OrderUpdate = { status: newOrderStatus };
  const paymentUpdate: PaymentUpdate = { status: newPaymentStatus };
  if (newPaymentStatus === "approved") paymentUpdate.approved_at = now;
  if (newPaymentStatus === "cancelled") paymentUpdate.cancelled_at = now;
  if (newPaymentStatus === "failed") {
    paymentUpdate.failed_at = now;
    paymentUpdate.failed_reason = `Webhook: ${resultCd ?? ""} ${resultMsg ?? ""}`.trim();
  }

  const [orderRes, payRes] = await Promise.all([
    sb.from("orders").update(orderUpdate).eq("id", order.id),
    sb.from("payments").update(paymentUpdate).eq("order_id", order.id),
  ]);

  if (orderRes.error || payRes.error) {
    console.error("[webhook] DB update failed", {
      orderErr: orderRes.error,
      payErr: payRes.error,
    });
    return new Response("Server Error", { status: 500 });
  }

  console.log("[webhook] processed", {
    orderId: order.id,
    newOrderStatus,
    tid,
  });
  return new Response("OK", { status: 200 });
}
