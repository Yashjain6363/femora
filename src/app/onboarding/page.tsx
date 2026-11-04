import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { OnboardingChat } from "./OnboardingChat";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv, isValidSupabaseEnv } from "@/lib/supabase/env";
import { SITE_CONFIG } from "@/lib/constants";
import { LogoWatermark } from "@/components/shared/LogoWatermark";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Personalize Wellness",
  description: `Personalize your ${SITE_CONFIG.name} cycle and wellness profile.`,
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { url: sbUrl, key: sbKey } = getSupabasePublicEnv();
  if (!isValidSupabaseEnv(sbUrl, sbKey)) {
    redirect("/login?error=config");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/onboarding");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("onboarding")
    .eq("id", user.id)
    .maybeSingle();

  const ob = profile?.onboarding;
  const onboardingDone =
    !profileError &&
    ob &&
    typeof ob === "object" &&
    !Array.isArray(ob) &&
    "profileComplete" in ob &&
    (ob as { profileComplete?: boolean }).profileComplete === true;

  const sp = await searchParams;
  const allowRerun = sp?.edit === "1" || sp?.edit === "true";

  if (onboardingDone && !allowRerun) {
    redirect("/dashboard");
  }

  const greetingName =
    user.email?.split("@")[0] ||
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.split(" ")[0]
      : null) ||
    (typeof user.user_metadata?.name === "string"
      ? String(user.user_metadata.name).split(" ")[0]
      : null);

  return (
    <main className="min-h-screen px-4 pt-16 pb-24 bg-[#F8F3E9] text-[#101F3B] relative overflow-hidden">
      {/* Subtle FERMORA Brand Watermark */}
      <LogoWatermark variant="corner-top-right" opacity={0.04} />

      <div className="relative max-w-3xl mx-auto text-center mb-10 space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-8 h-10 relative">
            <Image
              src="/images/femora.logo.png"
              alt="FERMORA Logo"
              width={32}
              height={40}
              className="object-contain w-full h-full"
            />
          </div>
          <span className="font-display text-2xl font-semibold tracking-wider text-[#101F3B]">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <p className="text-xs font-semibold uppercase tracking-wider text-[#B66ACB]">
          Welcome{greetingName ? `, ${greetingName}` : ""}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#101F3B]">
          Personalize your wellness rhythm
        </h1>
        <p className="text-[#26334A]/70 text-sm max-w-md mx-auto font-light">
          A confidential, gentle check-in so FERMORA can model your cycle phases,
          craving support, and care reminders to your life.
        </p>
      </div>

      <div className="relative z-10">
        <OnboardingChat />
      </div>
    </main>
  );
}
