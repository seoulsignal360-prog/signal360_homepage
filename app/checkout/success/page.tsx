import { CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Container } from "@/app/components/ui/Container";
import { PillButton } from "@/app/components/ui/PillButton";
import { createServiceClient } from "@/utils/supabase/service";

export const metadata = {
  title: "결제 완료 - 시그널360",
  robots: { index: false, follow: false },
};

type SuccessPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { order: orderNumber } = await searchParams;
  if (!orderNumber) redirect("/checkout/fail?reason=invalid_order");

  const sb = createServiceClient();
  const { data: order } = await sb
    .from("orders")
    .select("order_number, status, amount, product_name_snapshot")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (!order || order.status !== "paid") {
    redirect(`/checkout/fail?order=${orderNumber}&reason=invalid_order`);
  }

  return (
    <main className="flex-1 bg-surface flex items-center py-16">
      <Container>
        <div className="max-w-lg mx-auto bg-white rounded-card shadow-lg p-12 text-center flex flex-col items-center gap-6">
          <CheckCircle2
            size={72}
            strokeWidth={2}
            className="text-emerald-500"
            aria-hidden="true"
          />
          <h1 className="text-h2 text-fg">결제가 완료되었습니다</h1>
          <div className="flex flex-col gap-3 w-full text-body">
            <div className="flex justify-between gap-3">
              <span className="text-muted">주문번호</span>
              <span className="text-fg font-medium">{order.order_number}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted">상품</span>
              <span className="text-fg font-medium truncate">
                {order.product_name_snapshot}
              </span>
            </div>
            <div className="flex justify-between gap-3 items-baseline">
              <span className="text-muted">결제금액</span>
              <span className="text-primary text-lead font-bold">
                {order.amount.toLocaleString("ko-KR")}원
              </span>
            </div>
          </div>
          <p className="text-body text-muted">
            고객님께 곧 분석 결과를 안내드립니다.
          </p>
          <PillButton href="/">메인으로</PillButton>
        </div>
      </Container>
    </main>
  );
}
