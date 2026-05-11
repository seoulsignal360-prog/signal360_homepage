"use client";

import { Loader2, Minus, Plus } from "lucide-react";
import type { CheckoutProduct } from "@/app/checkout/CheckoutForm";

const MIN_QTY = 1;
const MAX_QTY = 999;

export function OrderSummaryCard({
  product,
  quantity,
  onQuantityChange,
  isFormValid,
  isLoading,
  onSubmit,
}: {
  product: CheckoutProduct;
  quantity: number;
  onQuantityChange: (next: number) => void;
  isFormValid: boolean;
  isLoading: boolean;
  onSubmit: () => void;
}) {
  const disabled = !isFormValid || isLoading;
  const total = product.price * quantity;
  const dec = () => onQuantityChange(Math.max(MIN_QTY, quantity - 1));
  const inc = () => onQuantityChange(Math.min(MAX_QTY, quantity + 1));
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip non-digits; clamp to [MIN_QTY, MAX_QTY]. Empty input is treated as
    // MIN_QTY so the field always reflects a valid value when the user blurs.
    const raw = e.target.value.replace(/[^\d]/g, "");
    if (raw === "") return onQuantityChange(MIN_QTY);
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) return;
    onQuantityChange(Math.max(MIN_QTY, Math.min(MAX_QTY, n)));
  };

  return (
    <aside className="bg-white rounded-card p-6 lg:sticky lg:top-24 flex flex-col gap-5">
      <h2 className="text-h3 text-fg">주문 요약</h2>

      <div className="flex justify-between items-center gap-3">
        <span className="text-body text-fg">수량</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={dec}
            disabled={isLoading || quantity <= MIN_QTY}
            aria-label="수량 감소"
            className="w-8 h-8 rounded-full bg-card-light text-fg hover:bg-card disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Minus size={16} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={quantity}
            onChange={handleInputChange}
            disabled={isLoading}
            aria-label="수량"
            className="w-14 h-8 text-center text-body text-fg bg-card-light/30 rounded-md border border-card-light focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-60"
          />
          <button
            type="button"
            onClick={inc}
            disabled={isLoading || quantity >= MAX_QTY}
            aria-label="수량 증가"
            className="w-8 h-8 rounded-full bg-card-light text-fg hover:bg-card disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      <hr className="border-card-light" />

      <div className="flex justify-between gap-3 text-body">
        <span className="text-muted truncate">{product.name}</span>
        <span className="text-fg shrink-0">
          {product.price.toLocaleString("ko-KR")}원 × {quantity}
        </span>
      </div>

      <hr className="border-card-light" />

      <div className="flex justify-between items-baseline gap-3">
        <span className="text-lead text-fg">총 결제금액</span>
        <span className="text-h3 font-bold text-primary">
          {total.toLocaleString("ko-KR")}원
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
