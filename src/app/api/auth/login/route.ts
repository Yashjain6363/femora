import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { loginPasswordSchema } from "@/lib/validations";
import {
  createSupabaseAuthRouteClient,
  type AuthCookieJar,
} from "@/lib/auth/supabase-auth-route";
import { getSupabasePublicEnv, isValidSupabaseEnv } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = loginPasswordSchema.and(
  z.object({ next: z.string().optional() })
);

export async function POST(request: NextRequest) {
  const { url, key } = getSupabasePublicEnv();
  if (!isValidSupabaseEnv(url, key)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Server missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY on Vercel, then redeploy.",
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

  const jar: AuthCookieJar = [];
  const supabase = createSupabaseAuthRouteClient(request, jar);
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Auth not configured" }, { status: 503 });
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  const res = NextResponse.json(
    {
      ok: !error,
      error: error?.message ?? null,
    },
    { status: error ? 401 : 200 }
  );

  for (const c of jar) {
    res.cookies.set(c.name, c.value, c.options);
  }

  return res;
}
