import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv, isValidSupabaseEnv } from "@/lib/supabase/env";
import { SITE_CONFIG } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LogoWatermark } from "@/components/shared/LogoWatermark";
import { DashboardWelcomeStrip } from "./DashboardWelcomeStrip";
import { FermoraDashboardClient } from "./FermoraDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: `Your ${SITE_CONFIG.name} personal wellness space, cycle tracker, and care reminders.`,
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string; guest?: string }>;
}) {
  const sp = await searchParams;
  const isGuest = sp?.guest === "1";
  const { url: sbUrl, key: sbKey } = getSupabasePublicEnv();

  let user = null;
  const isSbValid = isValidSupabaseEnv(sbUrl, sbKey);

  if (isSbValid && !isGuest) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      user = null;
    }

    if (!user) {
      redirect("/login?next=/dashboard");
    }
  }

  const showWelcome = sp?.welcome === "1";

  const greetingName =
    (typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.split(" ")[0]
      : null) ||
    user?.email?.split("@")[0] ||
    "Wellness Seeker";

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-28 pb-20 bg-[#F8F3E9] text-[#101F3B] relative overflow-hidden">
        {/* Subtle logo pattern in header background */}
        <LogoWatermark variant="corner-top-right" size={260} opacity={0.035} />

        <div className="relative max-w-6xl mx-auto space-y-8 z-10">
          <DashboardWelcomeStrip showWelcome={showWelcome} />

          <FermoraDashboardClient
            userEmail={user?.email}
            userName={greetingName}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
