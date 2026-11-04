import type { NextRequest } from "next/server";

/**
 * Public URL for email redirects (Supabase). Prefer explicit SITE_URL on Vercel if proxies confuse headers.
 */
export function getRequestOrigin(request: NextRequest): string {
  const site =
    (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  if (site && /^https?:\/\//i.test(site)) {
    return site.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/^https?:\/\//, "").split("/")[0];
    return `https://${host}`;
  }

  const forwarded = request.headers.get("x-forwarded-host");
  const host = (forwarded ?? request.headers.get("host") ?? "")
    .split(",")[0]
    .trim();
  if (!host) return "http://localhost:3000";

  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ??
    (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");

  return `${proto}://${host}`;
}

export function authCallbackUrl(request: NextRequest, nextPath: string): string {
  const origin = getRequestOrigin(request);
  const next =
    nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/onboarding";
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
}
