import type { BudgetEntryRow, BudgetSummary } from "@/types/budget";

/** Each day in [from, to] inclusive, ISO yyyy-mm-dd */
export function dateRangeInclusive(from: string, to: string): string[] {
  const out: string[] = [];
  const a = new Date(from + "T12:00:00Z");
  const b = new Date(to + "T12:00:00Z");
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || a > b) return out;
  for (let d = new Date(a); d <= b; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export function buildBudgetSummary(
  entries: BudgetEntryRow[],
  from: string,
  to: string
): BudgetSummary {
  let totalIncomePaise = 0;
  let totalExpensePaise = 0;
  const expenseByCategoryPaise: Record<string, number> = {};

  const dayKeys = dateRangeInclusive(from, to);
  const netPerDay = new Map<string, number>();
  for (const d of dayKeys) netPerDay.set(d, 0);

  for (const e of entries) {
    if (e.occurred_on < from || e.occurred_on > to) continue;

    if (e.entry_type === "income") {
      totalIncomePaise += e.amount_paise;
    } else {
      totalExpensePaise += e.amount_paise;
      expenseByCategoryPaise[e.category] =
        (expenseByCategoryPaise[e.category] ?? 0) + e.amount_paise;
    }

    const net =
      e.entry_type === "income" ? e.amount_paise : -e.amount_paise;
    if (netPerDay.has(e.occurred_on)) {
      netPerDay.set(
        e.occurred_on,
        (netPerDay.get(e.occurred_on) ?? 0) + net
      );
    }
  }

  let running = 0;
  const dailyNetPaise = dayKeys.map((date) => {
    running += netPerDay.get(date) ?? 0;
    return { date, netPaise: running };
  });

  return {
    totalIncomePaise,
    totalExpensePaise,
    netPaise: totalIncomePaise - totalExpensePaise,
    expenseByCategoryPaise,
    dailyNetPaise,
  };
}
