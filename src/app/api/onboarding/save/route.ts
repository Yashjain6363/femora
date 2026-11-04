import { NextRequest, NextResponse } from "next/server";
import { onboardingSaveBodySchema } from "@/lib/onboarding-schema";
import {
  cycleDaysFromRegularity,
  estimateNextPeriodStart,
  foodIdeasForCravings,
  suggestMonthlySipInr,
} from "@/lib/period-and-plan";
import {
  createSupabaseAuthRouteClient,
  type AuthCookieJar,
} from "@/lib/auth/supabase-auth-route";
import { getSupabasePublicEnv, isValidSupabaseEnv } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { url, key } = getSupabasePublicEnv();
  if (!isValidSupabaseEnv(url, key)) {
    return NextResponse.json(
      { ok: false, error: "Supabase not configured on server." },
      { status: 503 }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = onboardingSaveBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data" },
      { status: 422 }
    );
  }

  const body = parsed.data;
  const lastRaw = body.lastPeriodDate?.trim();
  if (lastRaw && !/^\d{4}-\d{2}-\d{2}$/.test(lastRaw)) {
    return NextResponse.json(
      { ok: false, error: "Last period date must be YYYY-MM-DD" },
      { status: 422 }
    );
  }

  const jar: AuthCookieJar = [];
  const supabase = createSupabaseAuthRouteClient(request, jar);
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Auth not configured" }, { status: 503 });
  }

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json(
      { ok: false, error: "Please sign in again to continue." },
      { status: 401 }
    );
  }

  const cycleDays = cycleDaysFromRegularity(body.female?.cycleRegularity);
  const lastPeriod =
    body.gender === "female" && lastRaw && /^\d{4}-\d{2}-\d{2}$/.test(lastRaw)
      ? lastRaw
      : undefined;

  const nextPeriodEstimateIso =
    lastPeriod && body.gender === "female"
      ? estimateNextPeriodStart(lastPeriod, cycleDays)
      : undefined;

  const foodSuggestions = foodIdeasForCravings(
    body.female?.cravings as string[] | undefined
  );

  const sipHint = suggestMonthlySipInr(
    body.salaryMonthlyInr,
    body.investmentGoal
  );

  const recommendedSip = Math.min(
    sipHint.suggested,
    body.sipMonthlyInr > 0 ? body.sipMonthlyInr : sipHint.suggested
  );

  const planSummary = buildPlanSummary({
    salary: body.salaryMonthlyInr,
    sipChosen: body.sipMonthlyInr,
    recommendedSip,
    goal: body.investmentGoal,
    nextPeriod: nextPeriodEstimateIso,
    sipNote: sipHint.note,
  });

  const onboarding = {
    ...body,
    lastPeriodDate: lastPeriod,
    profileComplete: true as const,
    computed: {
      nextPeriodEstimateIso,
      cycleDaysUsed: body.gender === "female" ? cycleDays : undefined,
      foodSuggestions,
      recommendedSipInr: sipHint.suggested,
      planNote: sipHint.note,
      planSummary,
    },
  };

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      gender: body.gender,
      onboarding: onboarding as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error("[onboarding/save]", error.message);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not save profile. Ensure the profiles table exists (supabase/profiles.sql).",
      },
      { status: 500 }
    );
  }

  const res = NextResponse.json({
    ok: true,
    message: "Your Sakhi profile is saved.",
    computed: onboarding.computed,
  });

  for (const c of jar) {
    res.cookies.set(c.name, c.value, c.options);
  }

  return res;
}

function buildPlanSummary(p: {
  salary: number;
  sipChosen: number;
  recommendedSip: number;
  goal: string;
  nextPeriod?: string;
  sipNote: string;
}): string {
  const lines: string[] = [];
  lines.push(
    `Monthly money in hand (₹${p.salary.toLocaleString("en-IN")}): keep an emergency buffer before locking money in long-term funds.`
  );
  lines.push(
    `You chose SIP ₹${p.sipChosen.toLocaleString("en-IN")}/mo; a rule-of-thumb for ${p.goal} goals was around ₹${p.recommendedSip.toLocaleString("en-IN")}/mo  -  ${p.sipNote}`
  );
  if (p.nextPeriod) {
    lines.push(
      `Estimated next period start (approx.): ${p.nextPeriod}  -  plan lighter spend days before if you like.`
    );
  }
  lines.push(
    "This is educational, not investment advice  -  talk to a SEBI-registered advisor for personal suitability."
  );
  return lines.join("\n\n");
}
