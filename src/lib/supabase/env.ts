/**
 * Strips BOM, whitespace, and optional wrapping quotes  -  common when pasting into .env.local.
 */
export function normalizeSupabasePublicEnv(value: string | undefined): string {
  if (value === undefined || value === null) return "";
  let s = String(value).replace(/^\uFEFF/, "").trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

export function getSupabasePublicEnv(): { url: string; key: string } {
  return {
    url: normalizeSupabasePublicEnv(process.env.NEXT_PUBLIC_SUPABASE_URL),
    key: normalizeSupabasePublicEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  };
}

export function isValidSupabaseEnv(url: string, key: string): boolean {
  const u = url.trim();
  const k = key.trim();
  if (!u || !k) return false;
  if (k.length < 12) return false;

  const uLower = u.toLowerCase();
  const kLower = k.toLowerCase();

  if (
    uLower.includes("paste_your") ||
    kLower.includes("paste_your") ||
    uLower.includes("your-project.supabase.co") ||
    kLower === "your-anon-key"
  ) {
    return false;
  }

  try {
    const parsed = new URL(u);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
  } catch {
    return false;
  }

  return true;
}

/** Shown when the browser bundle has no valid Supabase public env (wrong file, typo, or dev server not restarted). */
export const SUPABASE_PUBLIC_ENV_HINT =
  "Supabase isn’t loading. Fix: (1) Create .env.local in the project root next to package.json. (2) Add NEXT_PUBLIC_SUPABASE_URL=https://YOUR-REF.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ… (Project Settings → API in Supabase). (3) No spaces around =. (4) Stop the terminal completely and run npm run dev again so Next.js picks up NEXT_PUBLIC_* variables.";
