// Single source of truth for checkout business rules shared between the
// client form, the order summary card, and the /api/payment/request server
// route. Changing a value here must keep client and server in sync.

/** Quantity stepper bounds. Orders are sold in multiples of QTY_STEP. */
export const QTY_MIN = 10;
export const QTY_MAX = 990;
export const QTY_STEP = 10;

/** Snap an arbitrary integer to the nearest valid quantity (multiple of
 *  QTY_STEP, clamped to [QTY_MIN, QTY_MAX]). Used to coerce free-typed
 *  values from the input box on blur/submit. */
export function snapQuantity(n: number): number {
  if (!Number.isFinite(n)) return QTY_MIN;
  const stepped = Math.round(n / QTY_STEP) * QTY_STEP;
  return Math.max(QTY_MIN, Math.min(QTY_MAX, stepped));
}

/** Strict validator used by the server. Returns true only for integers that
 *  are inside the range AND a multiple of QTY_STEP. */
export function isValidQuantity(n: unknown): n is number {
  return (
    typeof n === "number" &&
    Number.isInteger(n) &&
    n >= QTY_MIN &&
    n <= QTY_MAX &&
    n % QTY_STEP === 0
  );
}

/** DB-distribution regions a buyer can target. Order is significant —
 *  shown in the dropdown in this order. */
export const REGIONS = [
  "수도권 (서울/경기/인천)",
  "강원",
  "충북",
  "대전/세종/충남",
  "전북",
  "광주/전남",
  "대구/경북",
  "부산/울산/경남",
  "제주",
] as const;

export type Region = (typeof REGIONS)[number];

export function isValidRegion(value: unknown): value is Region {
  return typeof value === "string" && (REGIONS as readonly string[]).includes(value);
}
