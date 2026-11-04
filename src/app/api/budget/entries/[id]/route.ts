import { NextRequest, NextResponse } from "next/server";
import {
  createSupabaseAuthRouteClient,
  type AuthCookieJar,
} from "@/lib/auth/supabase-auth-route";
import { getSupabasePublicEnv, isValidSupabaseEnv } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { url, key } = getSupabasePublicEnv();
  if (!isValidSupabaseEnv(url, key)) {
    return NextResponse.json(
      { ok: false, error: "Server not configured." },
      { status: 503 }
    );
  }

  const { id: rawId } = await context.params;
  const id = rawId?.trim() ?? "";
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ ok: false, error: "Invalid entry id." }, { status: 422 });
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
    return NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("budget_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 }
    );
  }

  if (!data?.length) {
    return NextResponse.json(
      { ok: false, error: "Entry not found or already deleted." },
      { status: 404 }
    );
  }

  const res = NextResponse.json({ ok: true, deletedId: id });
  for (const { name, value, options } of jar) {
    res.cookies.set(name, value, options);
  }
  return res;
}
