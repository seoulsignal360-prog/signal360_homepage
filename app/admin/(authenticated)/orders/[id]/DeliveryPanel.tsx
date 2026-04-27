"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { upsertDelivery } from "../actions";

const DELIVERY_STATUS_OPTIONS = [
  { value: "pending", label: "대기" },
  { value: "in_progress", label: "진행 중" },
  { value: "delivered", label: "전달 완료" },
] as const;

type DeliveryStatus = (typeof DELIVERY_STATUS_OPTIONS)[number]["value"];

type Props = {
  orderId: string;
  initial: {
    status: DeliveryStatus;
    notes: string;
    resultFileUrl: string;
  };
  consultantEmail: string | null;
};

export function DeliveryPanel({ orderId, initial, consultantEmail }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<DeliveryStatus>(initial.status);
  const [notes, setNotes] = useState(initial.notes);
  const [fileUrl, setFileUrl] = useState(initial.resultFileUrl);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const dirty =
    status !== initial.status ||
    notes !== initial.notes ||
    fileUrl !== initial.resultFileUrl;

  const handleSave = () => {
    if (!dirty || pending) return;
    setError(null);
    startTransition(async () => {
      const res = await upsertDelivery(orderId, {
        status,
        notes,
        resultFileUrl: fileUrl,
      });
      if (res.ok) {
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  };

  return (
    <div className="bg-white rounded-card p-6 border border-card-light flex flex-col gap-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-h3 text-fg">배송 / 결과 전달</h2>
        {consultantEmail && (
          <span className="text-caption text-muted">
            담당자: <span className="text-fg">{consultantEmail}</span>
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-body font-medium text-fg">배송 상태</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as DeliveryStatus)}
          disabled={pending}
          className="h-10 px-3 border border-card-light rounded-lg bg-white text-body focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        >
          {DELIVERY_STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="text-caption text-muted">
          상태 변경 시 주문 상태도 함께 업데이트됩니다 (대기→결제 완료, 진행
          중→진행 중, 전달 완료→완료).
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-body font-medium text-fg">결과 파일 URL</label>
        <input
          type="url"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          disabled={pending}
          placeholder="https://..."
          className="h-10 px-3 border border-card-light rounded-lg bg-white text-body focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        />
        {fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-caption text-primary hover:underline"
          >
            새 탭에서 열기 →
          </a>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-body font-medium text-fg">담당자 메모</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          maxLength={2000}
          disabled={pending}
          placeholder="고객 응대 / 컨설팅 메모 (내부용)"
          className="w-full px-3 py-2 border border-card-light rounded-lg bg-white text-body focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 resize-y"
        />
        <span className="text-caption text-muted self-end">
          {notes.length} / 2000
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-caption text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || pending}
          className="h-10 px-4 rounded-lg bg-primary text-white text-caption font-medium hover:bg-[#4338CA] disabled:bg-card-light disabled:text-muted disabled:cursor-not-allowed flex items-center gap-2"
        >
          {pending && (
            <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
          )}
          저장
        </button>
      </div>
    </div>
  );
}
