import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateEdiDate, generateHashString } from "@/lib/seedpay/hash";
import type { PaymentRequestParams } from "@/lib/seedpay/types";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/service";

const PHONE_RE = /^010-\d{4}-\d{4}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RequestBody = {
  productSlug?: string;
  buyer?: { name?: string; phone?: string; email?: string };
  agreements?: { terms?: boolean; privacy?: boolean; payment?: boolean };
};

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ error: code, message }, { status });
}

export async function POST(request: Request) {
  // 1. Parse body
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "INVALID_JSON", "Invalid JSON body");
  }

  // 2. Validate input
  const slug = body.productSlug;
  const buyer = body.buyer;
  const agreements = body.agreements;
  if (!slug || typeof slug !== "string") {
    return jsonError(400, "VALIDATION", "productSlug is required");
  }
  if (!buyer?.name || buyer.name.trim().length < 2) {
    return jsonError(400, "VALIDATION", "이름을 2자 이상 입력해주세요");
  }
  if (!buyer.phone || !PHONE_RE.test(buyer.phone)) {
    return jsonError(400, "VALIDATION", "연락처 형식이 올바르지 않습니다");
  }
  if (buyer.email && !EMAIL_RE.test(buyer.email)) {
    return jsonError(400, "VALIDATION", "이메일 형식이 올바르지 않습니다");
  }
  if (!agreements?.terms || !agreements?.privacy || !agreements?.payment) {
    return jsonError(400, "VALIDATION", "약관 동의가 필요합니다");
  }

  // 3. Fail-fast on env vars BEFORE any DB write
  const mid = process.env.SEEDPAY_MID;
  const merchantKey = process.env.SEEDPAY_MERCHANT_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!mid || !merchantKey) {
    console.error(
      "[payment/request] SeedPay env missing: MID=%s KEY=%s",
      !!mid,
      !!merchantKey
    );
    return jsonError(
      500,
      "SERVICE_UNAVAILABLE",
      "결제 서비스 설정이 완료되지 않았습니다"
    );
  }
  if (!siteUrl) {
    console.error("[payment/request] NEXT_PUBLIC_SITE_URL not set");
    return jsonError(500, "SERVICE_UNAVAILABLE", "site url not configured");
  }

  // 4. Look up product (server-trusted price/name)
  const sb = createServiceClient();
  const { data: product, error: productErr } = await sb
    .from("products")
    .select("id, slug, name, price")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (productErr) {
    console.error("[payment/request] product lookup failed", productErr);
    return jsonError(500, "DB_ERROR", "product lookup failed");
  }
  if (!product) {
    return jsonError(400, "INVALID_PRODUCT", "invalid product");
  }

  // 5. Generate order number via DB function
  const { data: orderNumberData, error: rpcErr } = await sb.rpc(
    "generate_order_number"
  );
  if (rpcErr || !orderNumberData) {
    console.error("[payment/request] order number RPC failed", rpcErr);
    return jsonError(500, "DB_ERROR", "order number generation failed");
  }
  const orderNumber = orderNumberData as string;

  // 6. Resolve auth (member vs guest)
  const cookieStore = await cookies();
  const authClient = createClient(cookieStore);
  const {
    data: { user },
  } = await authClient.auth.getUser();
  const userId = user?.id ?? null;

  // 7. INSERT order
  const { data: order, error: orderErr } = await sb
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: userId,
      is_guest: !userId,
      buyer_name: buyer.name.trim(),
      buyer_phone: buyer.phone,
      buyer_email: buyer.email || null,
      product_id: product.id,
      product_name_snapshot: product.name,
      amount: product.price,
      status: "pending",
    })
    .select("id")
    .single();
  if (orderErr || !order) {
    console.error("[payment/request] order insert failed", orderErr);
    return jsonError(500, "DB_ERROR", "order creation failed");
  }

  // 7. Build SeedPay request params
  const ediDate = generateEdiDate();
  const goodsAmt = String(product.price);
  const hashString = generateHashString(mid, ediDate, goodsAmt, merchantKey);
  const formData: PaymentRequestParams = {
    method: "CARD",
    mid,
    goodsNm: product.name,
    ordNo: orderNumber,
    goodsAmt,
    ordNm: buyer.name.trim(),
    ordEmail: buyer.email || "",
    ordTel: buyer.phone.replace(/-/g, ""),
    mbsReserved: order.id,
    returnUrl: `${siteUrl}/api/payment/approve`,
    ediDate,
    hashString,
  };

  // 8. INSERT payment with raw_request audit; cleanup order on failure
  const { error: payErr } = await sb.from("payments").insert({
    order_id: order.id,
    pg_provider: "seedpay",
    method: "card",
    amount: product.price,
    status: "requested",
    raw_request: formData as unknown as Record<string, unknown>,
  });
  if (payErr) {
    console.error("[payment/request] payment insert failed", payErr);
    await sb.from("orders").delete().eq("id", order.id);
    return jsonError(500, "DB_ERROR", "payment record creation failed");
  }

  // 9. Return paymentUrl + form data for client-side redirect-style POST
  const paymentUrl = `${
    process.env.SEEDPAY_API_BASE || "https://devpay.seedpayments.co.kr"
  }/payment/v1/view/request`;

  return NextResponse.json({ paymentUrl, formData });
}
