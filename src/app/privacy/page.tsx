import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LogoWatermark } from "@/components/shared/LogoWatermark";
import { ShieldCheckIcon, ArrowRightIcon } from "@/components/ui/icons";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy, data sovereignty, and security commitments of FERMORA.",
};

export default function PrivacyPage() {
  const lastUpdated = "November 2026";

  return (
    <>
      <Navbar />
      <main id="main-content" className="relative bg-[#F8F3E9] text-[#101F3B] min-h-screen pt-28 pb-20">
        <LogoWatermark variant="corner-top-right" size={260} opacity={0.04} />

        <div className="container-max section-padding">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E6DDF4]/70 text-[#7A3E8E] text-xs font-semibold tracking-wider uppercase mb-4 border border-[#E8DFD5]">
              <ShieldCheckIcon size={14} className="text-[#B66ACB]" />
              Data Sovereignty Commitment
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#101F3B] tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-[#26334A]/80 leading-relaxed font-light">
              Last updated: {lastUpdated}. At FERMORA, we treat your reproductive health data with absolute confidentiality, dignity, and uncompromising security.
            </p>
          </div>

          {/* Privacy Pledge Card */}
          <div className="max-w-3xl mb-10 p-6 rounded-xl bg-[#FAF7F2] border border-[#B66ACB]/30">
            <h2 className="text-base font-semibold text-[#101F3B] mb-2">
              Our Non-Negotiable Privacy Pledge
            </h2>
            <p className="text-xs sm:text-sm text-[#26334A]/85 leading-relaxed font-light">
              We never sell, rent, or barter your period dates, symptom notes, sexual activity records, or personal wellness entries to third-party advertising networks, data brokers, insurance agencies, or government registries. Your personal data belongs exclusively to you.
            </p>
          </div>

          {/* Detailed Policy Sections */}
          <div className="max-w-3xl space-y-10 text-[#26334A]/90 text-sm sm:text-base leading-relaxed font-light">
            <section className="space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[#101F3B]">
                1. Information We Collect
              </h2>
              <p>
                To provide meaningful cycle intelligence and craving advice, we process the information you explicitly provide:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Account credentials such as your email address and authentication tokens.</li>
                <li>Menstrual cycle dates, period duration, and flow intensity.</li>
                <li>Self-reported symptoms (e.g. cramps, headache, fatigue) and mood states.</li>
                <li>Craving observations, dietary preferences, and personal reflection journals.</li>
                <li>Notification preferences for supplement or hydration reminders.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[#101F3B]">
                2. How We Protect Your Data
              </h2>
              <p>
                FERMORA implements modern cryptographic safeguards. Information transmitted between your client device and our servers is encrypted using industry-standard TLS 1.3 protocols. Where supported, cycle and journal records are stored using client-side partition boundaries to minimize server exposure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[#101F3B]">
                3. Purpose of Processing
              </h2>
              <p>
                Your information is used strictly to power the core FERMORA features: calculating cycle phases, providing tailored nutritional craving suggestions, organizing wellness reflections, and sending user-requested care reminders. We do not build commercial behavioral profiles or serve targeted advertisements.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[#101F3B]">
                4. Your Rights and Data Deletion
              </h2>
              <p>
                You retain complete control over your health profile. You have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Export your cycle logs, cravings, and journal entries in open JSON or CSV format.</li>
                <li>Clear individual cycle records or journal entries directly from the dashboard.</li>
                <li>Request immediate, permanent deletion of your complete account and all associated records by contacting privacy@fermora.app.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[#101F3B]">
                5. Third-Party Service Providers
              </h2>
              <p>
                We minimize external dependencies. In production, we utilize certified database infrastructure (Supabase) operating under strict data processing agreements. These providers process data solely on our behalf and are legally bound to uphold equivalent confidentiality standards.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[#101F3B]">
                6. Contact the Data Protection Officer
              </h2>
              <p>
                If you have questions regarding our data practices or wish to exercise your statutory data rights under GDPR or state privacy laws, please reach out to our privacy officer:
              </p>
              <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E8DFD5] text-xs sm:text-sm text-[#101F3B]">
                <p className="font-semibold">FERMORA Health Inc. Data Privacy Officer</p>
                <p>Email: care@fermora.app</p>
                <p>Subject: Privacy &amp; Data Subject Request</p>
              </div>
            </section>
          </div>

          {/* Quick link to Terms */}
          <div className="max-w-3xl mt-14 pt-8 border-t border-[#E8DFD5] flex items-center justify-between">
            <span className="text-xs sm:text-sm text-[#26334A]/70">
              Review our terms of use and clinical notices.
            </span>
            <Link
              href="/terms"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#B66ACB] hover:text-[#9C4EB3] transition-colors"
            >
              <span>Terms of Service</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
