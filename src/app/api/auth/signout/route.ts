import { NextRequest, NextResponse } from "next/server";
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
    return NextResponse.json({ ok: false, error: "Auth not configured" }, { status: 503 });
  }

  const jar: AuthCookieJar = [];
  const supabase = createSupabaseAuthRouteClient(request, jar);
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Auth not configured" }, { status: 503 });
  }

  await supabase.auth.signOut({ scope: "global" });

  const res = NextResponse.json({ ok: true });
  for (const c of jar) {
    res.cookies.set(c.name, c.value, c.options);
  }
  return res;
}
