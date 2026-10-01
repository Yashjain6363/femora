// Date utility helpers — no external deps needed

/**
 * Returns the absolute number of days between two dates (d1 - d2)
 */
export function differenceInDays(d1: Date, d2: Date): number {
  const ms = Math.abs(d1.getTime() - d2.getTime());
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

/**
 * Format a date to YYYY-MM-DD
 */
export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get today as YYYY-MM-DD
 */
export function todayString(): string {
  return toDateString(new Date());
}
