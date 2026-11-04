import { NextRequest, NextResponse } from "next/server";
import {
  createBudgetEntryBodySchema,
  bodyToAmountPaise,
  listBudgetQuerySchema,
} from "@/lib/budget-schema";
import { buildBudgetSummary } from "@/lib/budget-aggregate";
import {
  createSupabaseAuthRouteClient,
  type AuthCookieJar,
} from "@/lib/auth/supabase-auth-route";
import { getSupabasePublicEnv, isValidSupabaseEnv } from "@/lib/supabase/env";
import type { BudgetEntryRow } from "@/types/budget";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mapRow(r: Record<string, unknown>): BudgetEntryRow {
  return {
    id: String(r.id),
    user_id: String(r.user_id),
    entry_type: r.entry_type as BudgetEntryRow["entry_type"],
    amount_paise: Number(r.amount_paise),
    category: String(r.category ?? "other"),
    note: String(r.note ?? ""),
    occurred_on: String(r.occurred_on).slice(0, 10),
    created_at: String(r.created_at),
  };
}

export async function GET(request: NextRequest) {
  const { url, key } = getSupabasePublicEnv();
  if (!isValidSupabaseEnv(url, key)) {
    return NextResponse.json(
      { ok: false, error: "Server not configured." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const parsed = listBudgetQuerySchema.safeParse({
    from: searchParams.get("from"),
    to: searchParams.get("to"),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid query" },
      { status: 422 }
    );
  }

  const { from, to } = parsed.data;
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
    return NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("budget_entries")
    .select(
      "id,user_id,entry_type,amount_paise,category,note,occurred_on,created_at"
    )
    .eq("user_id", user.id)
    .gte("occurred_on", from)
    .lte("occurred_on", to)
    .order("occurred_on", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[budget/entries GET]", error.message);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not load budget data. Run supabase/budget.sql in your Supabase project.",
      },
      { status: 500 }
    );
  }

  const entries = (data ?? []).map((r) =>
    mapRow(r as Record<string, unknown>)
  );
  const summary = buildBudgetSummary(entries, from, to);

  const res = NextResponse.json({ ok: true, entries, summary, range: { from, to } });
  for (const c of jar) {
    res.cookies.set(c.name, c.value, c.options);
  }
  return res;
}

export async function POST(request: NextRequest) {
  const { url, key } = getSupabasePublicEnv();
  if (!isValidSupabaseEnv(url, key)) {
    return NextResponse.json(
      { ok: false, error: "Server not configured." },
      { status: 503 }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createBudgetEntryBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Invalid data",
        issues: parsed.error.issues,
      },
      { status: 422 }
    );
  }

  const body = parsed.data;
  const amount_paise = bodyToAmountPaise(body);

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
    return NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("budget_entries")
    .insert({
      user_id: user.id,
      entry_type: body.entryType,
      amount_paise,
      category: body.category,
      note: body.note ?? "",
      occurred_on: body.occurredOn,
    })
    .select(
      "id,user_id,entry_type,amount_paise,category,note,occurred_on,created_at"
    )
    .single();

  if (error) {
    console.error("[budget/entries POST]", error.message);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not save entry. Ensure budget_entries table exists (supabase/budget.sql).",
      },
      { status: 500 }
    );
  }

  const entry = mapRow(data as Record<string, unknown>);
  const res = NextResponse.json({ ok: true, entry });
  for (const c of jar) {
    res.cookies.set(c.name, c.value, c.options);
  }
  return res;
}
