import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv, isValidSupabaseEnv } from "./env";

export function createBrowserSupabase(): SupabaseClient | null {
  const { url, key } = getSupabasePublicEnv();
  if (!isValidSupabaseEnv(url, key)) return null;
  return createBrowserClient(url, key);
}
