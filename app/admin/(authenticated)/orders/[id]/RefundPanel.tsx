"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { processRefund } from "../actions";

const krw = new Intl.NumberFormat("ko-KR");

type Props = {
  orderId: string;
  amount: number;
};

export function RefundPanel({ orderId, amount }: Props) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const res = await processRefund(orderId, reason);
      if (res.ok) {
        router.refresh();
      } else {
        setError(res.error);
        setConfirming(false);
      }
    });
  };

  const canSubmit = reason.trim().length >= 2 && !pending;

  return (
    <div className="bg-white rounded-card p-6 border border-card-light flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-h3 text-fg">환불 처리</h2>
        <span className="text-caption text-muted">
          전액 환불: <span className="text-fg font-medium">{krw.format(amount)}원</span>
        </span>
      </div>

      <textarea
        value={reason}
        onChange={(e) => {
          setReason(e.target.value);
          setConfirming(false);
        }}
        rows={3}
        maxLength={200}
        disabled={pending}
        placeholder="환불 사유 (필수, 2~200자)"
        className="w-full px-3 py-2 border border-card-light rounded-lg bg-white text-body focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 resize-y"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-caption text-red-700">
          {error}
        </div>
      )}

      {confirming ? (
        <div className="flex flex-col gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-body text-red-800">
            정말로 {krw.format(amount)}원을 환불하시겠습니까? 이 작업은
            되돌릴 수 없습니다.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={pending}
              className="h-10 px-4 rounded-lg border border-card-light text-caption text-muted hover:text-fg disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={pending}
              className="h-10 px-4 rounded-lg bg-red-600 text-white text-caption font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              {pending && (
                <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
              )}
              환불 확정
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={!canSubmit}
            className="h-10 px-4 rounded-lg bg-red-600 text-white text-caption font-medium hover:bg-red-700 disabled:bg-card-light disabled:text-muted disabled:cursor-not-allowed"
          >
            환불 요청
          </button>
        </div>
      )}
    </div>
  );
}
