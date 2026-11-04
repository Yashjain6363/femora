import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { getSupabasePublicEnv, isValidSupabaseEnv } from "@/lib/supabase/env";

export type AuthCookieJar = { name: string; value: string; options?: CookieOptions }[];

/** Supabase client for Route Handlers: reads request cookies, collects Set-Cookie into `jar`. */
export function createSupabaseAuthRouteClient(
  request: NextRequest,
  jar: AuthCookieJar
) {
  const { url, key } = getSupabasePublicEnv();
  if (!isValidSupabaseEnv(url, key)) return null;

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        jar.length = 0;
        jar.push(...cookiesToSet);
      },
    },
  });
}
