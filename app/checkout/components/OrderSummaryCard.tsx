"use client";

import { Loader2 } from "lucide-react";
import type { CheckoutProduct } from "@/app/checkout/CheckoutForm";

export function OrderSummaryCard({
  product,
  isFormValid,
  isLoading,
  onSubmit,
}: {
  product: CheckoutProduct;
  isFormValid: boolean;
  isLoading: boolean;
  onSubmit: () => void;
}) {
  const disabled = !isFormValid || isLoading;
  return (
    <aside className="bg-white rounded-card p-6 lg:sticky lg:top-24 flex flex-col gap-5">
      <h2 className="text-h3 text-fg">주문 요약</h2>

      <div className="flex justify-between gap-3 text-body">
        <span className="text-muted truncate">{product.name}</span>
        <span className="text-fg shrink-0">
          {product.price.toLocaleString("ko-KR")}원
        </span>
      </div>

      <hr className="border-card-light" />

      <div className="flex justify-between items-baseline gap-3">
        <span className="text-lead text-fg">총 결제금액</span>
        <span className="text-h3 font-bold text-primary">
          {product.price.toLocaleString("ko-KR")}원
        </span>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className={`w-full h-14 rounded-pill text-lead font-bold transition-colors flex items-center justify-center gap-2 ${
          disabled
            ? "bg-card-light text-muted cursor-not-allowed"
            : "bg-primary text-white hover:bg-[#4338CA] active:bg-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 size={20} strokeWidth={2.5} className="animate-spin" />
            결제 진행 중
          </>
        ) : (
          "결제하기"
        )}
      </button>
    </aside>
  );
}
