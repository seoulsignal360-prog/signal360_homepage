"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { updateOrderMemo, updateOrderStatus } from "../actions";
import {
  ORDER_STATUSES,
  STATUS_LABEL,
  type OrderStatus,
} from "../types";

type Props = {
  orderId: string;
  initialStatus: OrderStatus;
  initialMemo: string;
};

export function OrderEditPanel({
  orderId,
  initialStatus,
  initialMemo,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [memo, setMemo] = useState(initialMemo);
  const [savedStatus, setSavedStatus] = useState<OrderStatus>(initialStatus);
  const [savedMemo, setSavedMemo] = useState(initialMemo);
  const [error, setError] = useState<string | null>(null);
  const [statusPending, startStatus] = useTransition();
  const [memoPending, startMemo] = useTransition();

  const handleStatusSave = () => {
    if (status === savedStatus || statusPending) return;
    setError(null);
    startStatus(async () => {
      const res = await updateOrderStatus(orderId, status);
      if (res.ok) {
        setSavedStatus(status);
        router.refresh();
      } else {
        setError(res.error);
        setStatus(savedStatus);
      }
    });
  };

  const handleMemoSave = () => {
    if (memo === savedMemo || memoPending) return;
    setError(null);
    startMemo(async () => {
      const res = await updateOrderMemo(orderId, memo);
      if (res.ok) {
        setSavedMemo(memo);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  };

  const statusDirty = status !== savedStatus;
  const memoDirty = memo !== savedMemo;

  return (
    <div className="bg-white rounded-card p-6 border border-card-light flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-body font-medium text-fg">주문 상태</label>
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            disabled={statusPending}
            className="flex-1 h-10 px-3 border border-card-light rounded-lg bg-white text-body focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleStatusSave}
            disabled={!statusDirty || statusPending}
            className="h-10 px-4 rounded-lg bg-primary text-white text-caption font-medium hover:bg-[#4338CA] disabled:bg-card-light disabled:text-muted disabled:cursor-not-allowed flex items-center gap-2"
          >
            {statusPending && (
              <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
            )}
            저장
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-body font-medium text-fg">관리자 메모</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={5}
          maxLength={2000}
          disabled={memoPending}
          placeholder="내부 운영 메모 (고객에게 노출되지 않음)"
          className="w-full px-3 py-2 border border-card-light rounded-lg bg-white text-body focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 resize-y"
        />
        <div className="flex justify-between items-center">
          <span className="text-caption text-muted">
            {memo.length} / 2000
          </span>
          <button
            type="button"
            onClick={handleMemoSave}
            disabled={!memoDirty || memoPending}
            className="h-9 px-4 rounded-lg bg-primary text-white text-caption font-medium hover:bg-[#4338CA] disabled:bg-card-light disabled:text-muted disabled:cursor-not-allowed flex items-center gap-2"
          >
            {memoPending && (
              <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
            )}
            메모 저장
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-caption text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
