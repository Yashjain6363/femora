const PAISE_PER_INR = 100;

/** Max single entry: ₹5,00,000  -  sanity cap */
export const MAX_ENTRY_INR = 500_000;

export function inrToPaise(inr: number): number {
  if (!Number.isFinite(inr) || inr <= 0) return 0;
  return Math.round(inr * PAISE_PER_INR);
}

export function paiseToInr(paise: number): number {
  if (!Number.isFinite(paise)) return 0;
  return paise / PAISE_PER_INR;
}

/** Display ₹12,345.50 */
export function formatInrFromPaise(paise: number, opts?: { maximumFractionDigits?: number }): string {
  const inr = paiseToInr(paise);
  const max = opts?.maximumFractionDigits ?? 2;
  return `₹${inr.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: max,
  })}`;
}

/** Parse user input like "1200", "1,200", "1200.5" → paise; null if invalid */
export function parseInrInputToPaise(raw: string): { paise: number } | { error: string } {
  const s = raw.replace(/,/g, "").trim();
  if (!s) return { error: "Enter an amount." };
  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0) return { error: "Enter a valid positive amount." };
  if (n > MAX_ENTRY_INR) return { error: `Amount must be at most ₹${MAX_ENTRY_INR.toLocaleString("en-IN")}.` };
  const paise = inrToPaise(n);
  if (paise < 1) return { error: "Amount is too small." };
  return { paise };
}

export function isoDateInUtcRange(d: Date): string {
  return d.toISOString().slice(0, 10);
}
