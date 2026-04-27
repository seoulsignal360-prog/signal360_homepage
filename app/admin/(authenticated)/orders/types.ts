export type OrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded"
  | "in_progress"
  | "completed";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "in_progress",
  "completed",
  "cancelled",
  "refunded",
  "failed",
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "결제 대기",
  paid: "결제 완료",
  in_progress: "진행 중",
  completed: "완료",
  cancelled: "취소",
  refunded: "환불",
  failed: "실패",
};

export const STATUS_BADGE: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  in_progress: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-200 text-gray-700",
  refunded: "bg-orange-100 text-orange-800",
  failed: "bg-red-100 text-red-800",
};

export function isOrderStatus(v: unknown): v is OrderStatus {
  return typeof v === "string" && (ORDER_STATUSES as string[]).includes(v);
}
