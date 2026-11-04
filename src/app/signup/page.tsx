import type { Metadata } from "next";
import { SignupForm } from "./SignupForm";
import { AuthPageChrome } from "@/components/auth/AuthPageChrome";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Create Account",
  description: `Join ${SITE_CONFIG.name}  -  your private women's wellness and cycle tracking space.`,
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignupPage({ searchParams }: Props) {
  const sp = await searchParams;
  const nextRaw = sp?.next;
  const nextPath =
    typeof nextRaw === "string" && nextRaw.startsWith("/") && !nextRaw.startsWith("//")
      ? nextRaw
      : "/onboarding";

  return (
    <AuthPageChrome variant="violet">
      <SignupForm nextPath={nextPath} />
    </AuthPageChrome>
  );
}
