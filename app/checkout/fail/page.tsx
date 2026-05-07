import { AlertCircle } from "lucide-react";
import { Container } from "@/app/components/ui/Container";
import { PillButton } from "@/app/components/ui/PillButton";

export const metadata = {
  title: "결제 실패 - 시그널360",
  robots: { index: false, follow: false },
};

const REASON_MESSAGES: Record<string, string> = {
  user_cancel: "결제가 취소되었습니다",
  signature_mismatch: "결제 검증에 실패했습니다. 다시 시도해주세요.",
  amount_mismatch:
    "결제 금액 정보가 일치하지 않습니다. 고객센터로 문의해주세요.",
  invalid_order: "주문 정보를 찾을 수 없습니다",
  approval_failed: "결제 승인에 실패했습니다",
  service_unavailable: "결제 서비스가 일시적으로 이용할 수 없습니다",
  parse_error: "결제 데이터 처리 중 오류가 발생했습니다",
};

type FailPageProps = {
  searchParams: Promise<{ order?: string; reason?: string; detail?: string }>;
};

export default async function FailPage({ searchParams }: FailPageProps) {
  const params = await searchParams;
  const reason = params.reason || "unknown";
  const orderNumber = params.order;
  const message = REASON_MESSAGES[reason] || "결제에 실패했습니다";
  const detail = params.detail?.trim();

  return (
    <main className="flex-1 bg-surface flex items-center py-16">
      <Container>
        <div className="max-w-lg mx-auto bg-white rounded-card shadow-lg p-12 text-center flex flex-col items-center gap-6">
          <AlertCircle
            size={72}
            strokeWidth={2}
            className="text-red-500"
            aria-hidden="true"
          />
          <h1 className="text-h2 text-fg">결제에 실패했습니다</h1>
          <p className="text-body text-muted">{message}</p>
          {detail && (
            <p className="text-caption text-fg bg-surface px-4 py-3 rounded-md w-full">
              {detail}
            </p>
          )}
          {orderNumber && (
            <div className="flex justify-between gap-3 w-full text-body">
              <span className="text-muted">주문번호</span>
              <span className="text-fg font-medium">{orderNumber}</span>
            </div>
          )}
          <div className="flex flex-col items-stretch gap-3 w-full">
            <PillButton href="/#service">다시 시도</PillButton>
            <a
              href="https://pf.kakao.com/_signal360"
              target="_blank"
              rel="noopener noreferrer"
              className="text-caption text-muted hover:text-primary transition-colors"
            >
              고객센터 문의 →
            </a>
          </div>
        </div>
      </Container>
    </main>
  );
}
