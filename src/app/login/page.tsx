import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { AuthPageChrome } from "@/components/auth/AuthPageChrome";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Log in",
  description: `Sign in to ${SITE_CONFIG.name} with password or magic link.`,
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const err = typeof sp?.error === "string" ? sp.error : undefined;
  const nextRaw = sp?.next;
  const nextPath =
    typeof nextRaw === "string" && nextRaw.startsWith("/") && !nextRaw.startsWith("//")
      ? nextRaw
      : "/dashboard";

  return (
    <AuthPageChrome variant="rose">
      <LoginForm initialError={err} nextPath={nextPath} />
    </AuthPageChrome>
  );
}
