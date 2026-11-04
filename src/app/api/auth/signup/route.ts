import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { signupSchema } from "@/lib/validations";
import { authCallbackUrl } from "@/lib/auth/request-origin";
import {
  createSupabaseAuthRouteClient,
  type AuthCookieJar,
} from "@/lib/auth/supabase-auth-route";
import { isValidSupabaseEnv, getSupabasePublicEnv } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = signupSchema.and(
  z.object({
    next: z.string().optional(),
  })
);

export async function POST(request: NextRequest) {
  const { url, key } = getSupabasePublicEnv();
  if (!isValidSupabaseEnv(url, key)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Server missing Supabase env. In Vercel add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then redeploy.",
      },
      { status: 503 }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 }
    );
  }

  const nextParam = parsed.data.next;
  const nextPath =
    typeof nextParam === "string" &&
    nextParam.startsWith("/") &&
    !nextParam.startsWith("//")
      ? nextParam
      : "/onboarding";

  const jar: AuthCookieJar = [];
  const supabase = createSupabaseAuthRouteClient(request, jar);
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Auth not configured" }, { status: 503 });
  }

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: authCallbackUrl(request, nextPath),
      data: { full_name: parsed.data.fullName ?? "" },
    },
  });

  const res = NextResponse.json(
    {
      ok: !error,
      needsEmailConfirmation: !data.session,
      error: error?.message ?? null,
    },
    { status: error ? 400 : 200 }
  );

  for (const c of jar) {
    res.cookies.set(c.name, c.value, c.options);
  }

  if (!error && !data.session) {
    /* no Set-Cookie from Supabase when email confirm is on  -  expected */
  }

  return res;
}
