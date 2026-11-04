/** Rough cycle length from onboarding cycle regularity answer */
export function cycleDaysFromRegularity(
  regularity: string | undefined
): number {
  switch (regularity) {
    case "somewhat_irregular":
      return 30;
    case "not_tracking":
    case "prefer_not_to_say":
    case "regular":
    default:
      return 28;
  }
}

/** ISO date string yyyy-mm-dd → next period start (approximate) */
export function estimateNextPeriodStart(
  lastPeriodIso: string,
  cycleDays: number
): string {
  const d = new Date(lastPeriodIso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + cycleDays);
  return d.toISOString().slice(0, 10);
}

export function foodIdeasForCravings(
  cravingIds: string[] | undefined
): string[] {
  if (!cravingIds?.length) {
    return [
      "Balanced plate: dal + rice/roti + sabzi  -  cheap and steady energy.",
      "Seasonal fruit from a local vendor instead of packaged sweets.",
    ];
  }
  const out: string[] = [];
  for (const c of cravingIds) {
    if (c === "sweet") {
      out.push(
        "Sweet tooth: jaggery + peanut chikki in small pieces, or fruit chaat with a pinch of black salt."
      );
    }
    if (c === "salty") {
      out.push(
        "Salty crunch: roasted makhana or roasted chana  -  bulk packs last longer."
      );
    }
    if (c === "comfort_food") {
      out.push(
        "Comfort: khichdi with extra veggies, or curd rice  -  filling and gentle."
      );
    }
    if (c === "caffeine") {
      out.push(
        "Caffeine: try cutting one cup with hot milk or lemon water in the afternoon."
      );
    }
    if (c === "varies_no_pattern") {
      out.push(
        "Keep a ₹200/week “craving buffer” in UPI so small treats don’t derail the budget."
      );
    }
  }
  if (!out.length) {
    out.push("Home-cooked meals 4–5 days/week save more than strict dieting.");
  }
  return [...new Set(out)].slice(0, 5);
}

/** Simple educational SIP suggestion  -  not financial advice */
export function suggestMonthlySipInr(
  salaryMonthly: number,
  goal: "emergency" | "growth" | "short_term"
): { suggested: number; note: string } {
  if (!Number.isFinite(salaryMonthly) || salaryMonthly <= 0) {
    return { suggested: 0, note: "Add your monthly money in hand to get a SIP range." };
  }
  const pct = goal === "emergency" ? 0.12 : goal === "growth" ? 0.18 : 0.1;
  const raw = Math.round(salaryMonthly * pct);
  const suggested = Math.max(500, Math.min(raw, Math.round(salaryMonthly * 0.25)));
  const rounded = Math.round(suggested / 100) * 100;
  return {
    suggested: rounded,
    note:
      goal === "emergency"
        ? "Prioritises a liquid cushion before higher risk."
        : goal === "growth"
          ? "Longer horizon; keep emergency fund separate first."
          : "Keeps more in hand for near-term goals.",
  };
}
